import { Editor } from "@monaco-editor/react";
import '../resources/monaco_cdn_to_local'
import { Stack,} from "@mui/material";
import { useState } from "react";

// memo
function CodeEditor({lang, 
                    codeRef,
                    width="100%",
                    height="100%"}) {
    
    
    const [code, setCode] = useState('');
    
    function updateCode(code) {
        setCode(code);
        codeRef.current = code;
    }
    
    return (
        <Stack width={width} height={height}>
            <Stack height={"100%"}>
                <Editor
                    language={lang}
                    defaultLanguage="javascript" 
                    defaultValue="// some comment" 
                    onChange={(code, event) => updateCode(code)}
                    value={code}
                />
            </Stack>
        </Stack>
    )
}

export default CodeEditor;