import { useState, useRef, useEffect, useCallback } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { Box, Stack, Typography, Button } from "@mui/material";
import '@xterm/xterm/css/xterm.css';

function Output({socket, lang, isProgRunning, setIsProgRunning}) {
    const termRef = useRef(null);
    const fitAddonRef = useRef(null);
    const inputBufferRef = useRef('');
    const [prevLang, setPrevLang] = useState(lang);
    const inputRef = useRef({codeInput: '', language: '', code: "", messageType: 2});

    useEffect(() => {
        if(socket !== null && termRef !== null) {
            if(!isProgRunning) {
                setPrevLang(lang);
                termRef.current.reset(); 
            }
            else {
                inputRef.current.messageType = 2;
                inputRef.current.language = prevLang;
                
                socket.send(JSON.stringify(inputRef.current));
            }
        }
    }, [socket, lang]);
     
    useEffect(() => {
        const term = new Terminal({
            cursorBlink: true,
            fontSize: 16,
            theme: { background: '#333333' }
        });
        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(document.getElementById('terminal'));
        fitAddon.fit();
        term.focus();

        window.addEventListener('resize', () => {
            fitAddon.fit();
        });

        termRef.current = term;
        fitAddonRef.current = fitAddon;
        
        return () => {
            term.dispose();
            window.removeEventListener('resize', () => fitAddon.fit());
        };
    }, []);
 
    useEffect(() => {
        let disposable = null;

        if(socket === null && termRef.current !== null) {
            termRef.current.write("Connection to Server failed!\r\n");
        }
        else {
            socket.onmessage = (event) => {
                const output = JSON.parse(event.data);
                
                if(output.terminated) {
                    
                    if(lang !== prevLang) {
                        setPrevLang(lang);
                        termRef.current.reset(); 
                    }
                    else {
                        if(Number.isInteger(Number(output.str))) {
                            termRef.current.write("\r\nExit Code: " + output.str);
                        }
                        else {
                            termRef.current.write("\r\n" + output.str);
                        }
                        termRef.current.write("\r\n" + '='.repeat(termRef.current.cols - 1) + "\r\n\n");
                    }

                    setIsProgRunning(false);
                }
                else {
                    if(output.str === "\n")
                        termRef.current.write("\r\n");
                    else
                        termRef.current.write(output.str);
                }
            };
    
            disposable = termRef.current.onData(data => {
                if (data === '\r') { 
                    // User pressed Enter
                    // const toSend = inputBufferRef.current + '\n'; // Add newline
    
                    if(inputBufferRef.current.length != 0) {
                        inputRef.current.codeInput = inputBufferRef.current + "\n";
                        inputRef.current.messageType = 1;
                        inputRef.current.language = prevLang;
    
                        socket.send(JSON.stringify(inputRef.current));
                        inputBufferRef.current = ''; // Clear buffer
                    }
    
                    termRef.current.write("\r\n");
                } else if (data === '\u007f') {
                    // Handle Backspace
                    if (inputBufferRef.current.length > 0) {
                        inputBufferRef.current = inputBufferRef.current.slice(0, -1);
                        termRef.current.write('\b \b'); // Delete character visually
                    }
                } else {
                    inputBufferRef.current += data; // Accumulate user typing
                    termRef.current.write(data); // Echo on terminal
                }
            });
        }
        return () => {
            if(disposable !== null)
                disposable.dispose();

            if(socket !== null)
                socket.onmessage = undefined;
        }
    }, [socket, lang, prevLang]);

    return (
        <Stack flexGrow={1}>
            <Box borderBottom={"1px solid grey"} bgcolor={"#f0f0f0"}>
                <Stack direction={"row"} width={"50%"} p={1} alignItems={"center"} spacing={2}>
                    <Typography 
                        fontFamily={"Fira Mono"} 
                        fontSize={25} 
                        color={"#003c52"} 
                        fontWeight={500}
                    >
                        Output
                    </Typography>
                    <Button 
                        size={"small"} 
                        variant="outlined"
                        onClick={(e) => termRef.current.reset()}
                        color="inherit"
                    >
                        Clear 
                    </Button>
                </Stack> 
            </Box>
            <Box 
                height={"100%"}
                bgcolor={" #333333"}
                pl={"2%"}
                pt={"2%"}
            >
                <Box id="terminal" height={"100%"} />
            </Box>
        </Stack>
    )
}

export default Output;