import { Editor } from "@monaco-editor/react";
import '../scripts/monaco_cdn_to_local'
import { Button, Stack, Typography, Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useState } from "react";

// memo
function CodeEditor({lang, 
                    setLang,
                    langs,
                    socket, 
                    isProgRunning, 
                    setIsProgRunning, 
                    reset,
                    width="100%"}) {

    const [code, setCode] = useState('');

    const data = {
        code: code,
        language: lang,
        codeInput: "",
        messageType: 0
    }

    function handleRun() {
        if(socket === null) {
            reset();
        }
        else {
            socket.send(JSON.stringify(data));
            setIsProgRunning(true);
        }
    }

    function handleKill() {
        if(socket !== null) {
            let tempData = {
                code: "",
                language: lang,
                codeInput: "",
                messageType: 2
            }

            socket.send(JSON.stringify(tempData));
        }
    }

    return (
        <Stack width={width}>
            <Box borderBottom={"1px solid grey"} bgcolor={"#f0f0f0"}>
                <Stack direction={"row"} width={"100%"} p={1} alignItems={"center"} spacing={2}>
                    <Typography 
                        fontFamily={"Fira Mono"} 
                        fontSize={25} 
                        color={"#003c52"} 
                        fontWeight={500}
                    >
                            Code
                    </Typography>

                    <Button 
                        size={"small"} 
                        variant="contained"
                        onClick={isProgRunning ? handleKill : handleRun}
                        color={socket === null ? "error" : isProgRunning ? "error" : "info"} 
                    >
                        {socket === null ? "Connect" : isProgRunning ? "Kill" : "Run"}
                    </Button>

                    <FormControl size="small" sx={{minWidth: "20%"}}>
                      <InputLabel id="language-selected">language</InputLabel>
                      <Select
                        labelId="language-selected"
                        id="demo-simple-select"
                        value={lang}
                        label="language"
                        onChange={(event) => setLang(event.target.value)}
                      >
                            {Object.entries(langs).sort().map(([l, [runner, version]]) => {
                                return <MenuItem value={l} key={l}>{l} ({runner} {version})</MenuItem>
                            })}
                      </Select>
                    </FormControl>
                </Stack> 
            </Box>
            <Stack height={"100%"}>
                <Editor
                    language={lang}
                    defaultLanguage="javascript" 
                    defaultValue="// some comment" 
                    onChange={(code, event) => setCode(code)}
                />
            </Stack>
        </Stack>
    )
}

export default CodeEditor;