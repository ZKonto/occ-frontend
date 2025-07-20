import { useEffect, useState } from "react";
import CodeEditor from "./components/CodeEditor";
import Output from "./components/Output";
import { Stack } from "@mui/material";
import './App.css';
import config from './scripts/config';

function Advice() {
    
    // TODO: useContext
    
    const [lang, setLang] = useState('');
    const [socket, setSocket] = useState(null);
    const [langs, setLangs] = useState({});
    const [isProgRunning, setIsProgRunning] = useState(false);

    function openSocket() {
        const socket = new WebSocket(import.meta.env.DEV ? `${config.BASE_URL_WS}` : `${config.BASE_URL_WSS}`);
        
        socket.onopen = () => {
            setSocket(socket);
        }
        
        socket.onclose = () => {
            setSocket(null);
        }

        socket.onerror = () => {
            setSocket(null);
        }
    }

    async function fetchLangs() {
        const res = await fetch(import.meta.env.DEV ? `${config.BASE_URL_HTTP}/langrunner/info/` : `${config.BASE_URL_HTTPS}/langrunner/info/`, {
            headers: {'ngrok-skip-browser-warning': 'true'}
        });
        const langs = await res.json();
        setLangs(langs);
    }
    
    async function reset() {
        openSocket();

        if(Object.entries(langs).length == 0)
            fetchLangs();
    }

    useEffect(() => {
        reset();
    }, []);

    return (
        <Stack direction={"row"} height={"100vh"}>
            <Stack direction={"row"} flexGrow={1}>
                <CodeEditor 
                    lang={lang}
                    setLang={setLang}
                    langs={langs}
                    socket={socket} 
                    isProgRunning={isProgRunning}
                    setIsProgRunning={setIsProgRunning} 
                    reset={reset}
                    width="50%" 
                />

                <Output 
                    lang={lang} 
                    socket={socket} 
                    isProgRunning={isProgRunning} 
                    setIsProgRunning={setIsProgRunning}
                />
            </Stack>
        </Stack>
    ); 
}

export default Advice;