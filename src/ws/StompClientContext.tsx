'use client'
import { createContext, useContext, useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client, Stomp } from "@stomp/stompjs"
import { Props, ScriptProps } from "next/script";

interface StompClientContextProps {
    stompClient: Client | null;
    setStompClient: React.Dispatch<React.SetStateAction<Client | null>>;
    isConnected: boolean;
}

const StompClientContext = createContext<StompClientContextProps>({
    stompClient: null,
    setStompClient: () => { },
    isConnected: false
});

export function useStomp() {
    return useContext(StompClientContext);
}

export function StompClientProvider({ children }: ScriptProps) {
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const client = new Client({
            brokerURL: 'ws://localhost:8080/debug',
            debug: function (str) {
                console.log(str)
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: function (frame) {
                console.log('Connected: ' + frame);
                setIsConnected(true);
                // Weitere Logik hier
            },
            onStompError: function (frame) {
                console.log('Broker reported error: ' + frame.headers['message']);
                console.log('Additional details: ' + frame.body);
                setIsConnected(false);
            },
        });

        setStompClient(client);

        // Aktivieren Sie den Client

        client.activate();


        // Cleanup-Funktion
        return () => {
            if (client.connected) {
                client.deactivate();
            }
        }
    }, []);

    const contextValue = {
        stompClient,
        isConnected,
        setStompClient
    };

    return (
        <StompClientContext.Provider value={contextValue}>
            {children}
        </StompClientContext.Provider>
    );
}
