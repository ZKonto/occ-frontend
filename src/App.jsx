import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import useConn from "./hooks/useConn";

const App = () => {

    const {
        publish, 
        publish2,
        reconnect, 
        subscribe, 
        response, 
        retryCount, 
        isLoading, 
        err, 
        infoResponse, 
        publishInfoReq
    } = useConn(); 

    // if(!isLoading) {
        console.log("response: ", response);
    // }
    // useEffect(() => {
    //     subscribe("");
    // }, []);

    function getOutput() {

        const data = {
            command: "",
            sourceCode: "num = input('Enter a number: \\n'); print('You entered:', num)",
            language: "python"
        }
        publish(data);
    }
    
    function sendInput() {
        const inp = {
            command: "",
            sourceCode: "1",
            language: ""
        }
        
        publish2(inp);

    }
  return (
    <>
        <Button onClick={getOutput}>Run</Button>
        <Button onClick={sendInput}>Send</Button>
    </>
    // <div style={{ display: "flex", height: "100vh", justifyContent: "space-between"}}>
    //   <ResizableBox
    //     width={width1}
    //     height={Infinity}
    //     axis="x"
    //     resizeHandles={["e"]}
    //     minConstraints={[200, Infinity]} // Minimum width
    //     // maxConstraints={[800, Infinity]} // Maximum width
    //     onResize={(e, { size }) => {setWidth1(size.width); setWidth2(1920 - (size.width))}}
    //   >
    //     <div style={{display: "flex", flexDirection: "column", backgroundColor: "#f0f0f0", height: "100%" }}>
    //         <div style={{flex: 1, backgroundColor: "#c0c0c0"}}>
    //           Left Panel
    //         </div>
    //         <ResizableBox
    //             width={width1}
    //             height={height}
    //             axis="y"
    //             resizeHandles={["n"]}
    //             onResizeStop={(e, {size}) => {setHeight(size.height)}}
    //             style={{backgroundColor: "red"}}
    //         >
    //             <div style={{backgroundColor: "#d0d0d0", height: "100%"}}>
    //                 left bottom panel
    //             </div>
    //         </ResizableBox>

    //     </div>
    //   </ResizableBox>
    //   <div style={{ flex: 1, padding: "10px", backgroundColor: "#e0e0e0" }}>
    //     Right Panel
    //   </div>
    // </div>
  );
};

export default App;