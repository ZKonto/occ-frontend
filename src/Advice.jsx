import { useEffect, useState } from "react";
import CodeEditor from "./components/layout/CodeEditor";
import Output from "./components/layout/Output";
import { Stack } from "@mui/material";
import './App.css';

function Advice() {
    
    // TODO: useContext
    const [lang, setLang] = useState('');
    const [socket, setSocket] = useState(null);
    const [langs, setLangs] = useState({});
    const [isProgRunning, setIsProgRunning] = useState(false);

    function openSocket() {
        const socket = new WebSocket('wss://vervet-renewed-blowfish.ngrok-free.app/ws/execute');
        
        socket.onopen = () => {
            setSocket(socket);
        }
        
        socket.onclose = () => {
            setSocket(null);
        }

        socket.onerror = () => {
            console.log("ERROR");
            setSocket(null);
        }
    }

    async function fetchLangs() {
        const res = await fetch("https://vervet-renewed-blowfish.ngrok-free.app/langrunner/info/", {
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