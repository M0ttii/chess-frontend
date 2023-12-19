'use client'
import { createContext, useContext, useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client, Stomp } from "@stomp/stompjs"
import { Props, ScriptProps } from "next/script";

interface StompClientContextProps {
    stompClient: Client | null;
    setStompClient: React.Dispatch<React.SetStateAction<Client | null>>;
}

const StompClientContext = createContext<StompClientContextProps>({
    stompClient: null,
    setStompClient: () => { },
});

export function useStomp() {
    return useContext(StompClientContext);
}

export function StompClientProvider({ children }: ScriptProps) {
    const [stompClient, setStompClient] = useState<Client | null>(null);
    console.log("Test")
    useEffect(() => {
        //const sockJS = new SockJS("http://localhost:8080/test");
        const client = new Client({
            brokerURL: 'ws://localhost:8080/debug',
            debug: function (str) {
                console.log(str)
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });
        setStompClient(client);

        return () => {
            if (client && client.connected) {
                //client.disconnect();
            }
        }
    }, []);

    if (stompClient) {

        stompClient.onConnect = function (frame) {
            // Do something, all subscribes must be done is this callback
            // This is needed because this will be executed after a (re)connect
        };

        stompClient.onStompError = function (frame) {
            // Will be invoked in case of error encountered at Broker
            // Bad login/passcode typically will cause an error
            // Complaint brokers will set `message` header with a brief message. Body may contain details.
            // Compliant brokers will terminate the connection after any error
            console.log('Broker reported error: ' + frame.headers['message']);
            console.log('Additional details: ' + frame.body);
        };
    }

    return (
        <StompClientContext.Provider value={{ stompClient, setStompClient }}>
            {children}
        </StompClientContext.Provider>
    )
}