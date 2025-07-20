import { Client } from "@stomp/stompjs";
import { useCallback, useEffect, useState } from "react";

const client = new Client({
    brokerURL: "ws://localhost:8080/ws",
    onDisconnect: (m) => {
        console.log("disconnected", m.body);
    },
});

// TODO: add a websocket timeout support
function useConn() {
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState({compilerOp: "", execOp: ""});
    const [infoResponse, setInfoResponse] = useState({runner: "", runnerVersion: ""});
    const [retryCount, setRetryCount] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const [err, setErr] = useState(false);

    useEffect(() => {
        client.activate();
    }, []);
    
    client.onConnect = useCallback(() => {
        // eslint-disable-next-line no-unused-vars
        client.subscribe("/user/error", (m) => {
            setErr(true);
            setIsLoading(false);
        });

        // eslint-disable-next-line no-unused-vars
        client.subscribe("/user/info/result", (m) => {
            setInfoResponse(JSON.parse(m.body));
        });

        client.subscribe(`/comp-and-run/output/`, (m) => {
            console.log(m.body);
            
            setResponse(JSON.parse(m.body));
            // setIsLoading(false);
        });
        
        setRetryCount(0);
        setIsConnected(true); 
    }, []);
    
    // eslint-disable-next-line no-unused-vars
    client.onWebSocketClose = useCallback((err) => {
        setRetryCount(retryCount => retryCount+1);
    }, []);

    // eslint-disable-next-line no-unused-vars
    client.onStompError = useCallback((err) => {
        setRetryCount(4);
        client.deactivate();
    }, []);

    function publish(data) {
        client.publish({ destination: "/app/message", body: JSON.stringify(data)});
        // setIsLoading(true);
    }

    function publish2(data) {
        client.publish({ destination: "/app/input", body: JSON.stringify(data)});
    }

    function publishInfoReq(lang) {
        client.publish({destination: "/app/info", body: lang});
    }

    function reconnect() {
        client.deactivate();
        setIsConnected(false);
        setResponse({compilerOp: "", execOp: ""});
        setRetryCount(0);
        setErr(false);

        client.activate();
    }

    function subscribe(lang) {
        client.subscribe(`/comp-and-run/output/`, (m) => {
            setResponse(JSON.parse(m.body));
            // setIsLoading(false);
        });
    }

    return {
        publish, 
        publish2,
        reconnect, 
        subscribe, 
        response, 
        retryCount, 
        isLoading, 
        isConnected, 
        err, 
        infoResponse, 
        publishInfoReq
    };
}

export default useConn;