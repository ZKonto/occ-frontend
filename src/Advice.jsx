import { memo, useCallback, useEffect, useRef, useState } from "react";
import CodeEditor from "./components/CodeEditor";
import Output from "./components/Output";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from "@mui/material";
import './App.css';
import {vertSplitModel} from "./resources/layoutModel";
import { Layout } from "flexlayout-react";
import "flexlayout-react/style/light.css";

const LayoutMemo = memo(function LayoutMemo({model, factory}) {
    return <Layout model={model} factory={factory} onRenderDragRect={() => console.log("drag")}/>
});

function Advice() {
    const [lang, setLang] = useState('');
    const [langs, setLangs] = useState({});
    const [socket, setSocket] = useState(null);
    const [isProgRunning, setIsProgRunning] = useState(false);
    const [killSent, setKillSent] = useState(false);
    const [termReset, setTermReset] = useState(false);

    const codeRef = useRef('');
    const termRef = useRef(null);

    function openSocket() {
        const socket = new WebSocket(
            import.meta.env.DEV ? `ws://${import.meta.env.VITE_HOST}` : `wss://${import.meta.env.VITE_HOST}`
        );
        
        socket.onopen = () => {
            setSocket(socket);
            setTermReset(true);
        }
        
        socket.onclose = () => {
            setSocket(null);
        }

        socket.onerror = () => {
            setSocket(null);
        }
    }

    async function fetchLangs() {
        const res = await fetch(
            import.meta.env.DEV ? `http://${import.meta.env.VITE_HOST}/langrunner/info/` 
                : `https://${import.meta.env.VITE_HOST}/langrunner/info/`, {

            headers: {'ngrok-skip-browser-warning': 'true'}
        });

        const langs = await res.json();
        setLangs(langs);
    }
    
    async function initialize() {
        openSocket();

        if(Object.entries(langs).length == 0)
            fetchLangs();
    }

    function handleKill() {
        if(socket !== null && isProgRunning) {
            let data = {
                code: "",
                language: lang,
                codeInput: "",
                messageType: 2
            }
            
            setKillSent(true);
            socket.send(JSON.stringify(data));
        }
    }

    function handleRun() {
        if(socket !== null) {
            let data = {
                code: codeRef.current,
                language: lang,
                codeInput: "",
                messageType: 0
            }

            socket.send(JSON.stringify(data));
            setIsProgRunning(true);
        }
    }

    function handleLangChange(event) {
        setLang(event.target.value);
        setTermReset(true);
        handleKill();
    }

    const nodeFactory = useCallback((node) => {
        let component = node.getComponent();

        if(component === "Editor") {
            return <CodeEditor 
                        lang={lang}
                        codeRef={codeRef} 
                    />
        }

        if(component === "Output") {
            return <Output 
                        lang={lang} 
                        socket={socket}
                        progState={[isProgRunning, setIsProgRunning]}
                        termRefProp={termRef}
                    />
        }
    }, [lang, socket]);

    useEffect(() => {
        initialize();
    }, []);

    if(!isProgRunning && killSent) {
        setKillSent(false);
    }

    if(termReset && !isProgRunning) {
        termRef.current.reset();
        setTermReset(false);
    }

    return (
        <Stack direction={"column"} height={"100vh"} width={"100vw"}>
            <Stack 
                direction={"row"} 
                width={"100%"} 
                p={1} 
                alignItems={"center"} 
                spacing={2}
                bgcolor={"#f0f0f0"}
                position={"relative"}
            >
                <Typography 
                    fontFamily={"Fira Mono"} 
                    fontSize={25} 
                    color={"#003c52"} 
                    fontWeight={500}
                >
                    code_checkout
                </Typography>

                <FormControl size="small" sx={{minWidth: "12%"}}>
                    <InputLabel id="language-selected">language</InputLabel>
                    <Select
                    labelId="language-selected"
                    id="demo-simple-select"
                    value={lang}
                    label="language"
                    onChange={handleLangChange}
                    >
                        {Object.entries(langs).sort().map(([l, [runner, version]]) => {
                            return <MenuItem value={l} key={l}>{l} ({runner} {version})</MenuItem>
                        })}
                    </Select>
                </FormControl>

                <Button 
                    size={"small"} 
                    variant="contained"
                    onClick={socket === null ? initialize : isProgRunning ? handleKill : handleRun}
                    color={socket === null ? "error" : isProgRunning ? "error" : "info"} 
                    disabled={killSent}
                >
                    {socket === null ? "Connect" : isProgRunning ? "Kill" : "Run"}
                </Button>

                <Button 
                    size={"small"} 
                    variant="outlined"
                    onClick={(e) => termRef.current.reset()}
                    color="inherit"
                >
                    Clear 
                </Button>

            </Stack>
            <Box height={"100%"} position={"relative"}>
                <LayoutMemo 
                    model={vertSplitModel} 
                    factory={nodeFactory} 
                />
            </Box>
        </Stack>
    ); 
}

export default Advice;