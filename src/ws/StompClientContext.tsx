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
                // Weitere Logik hier
            },
            onStompError: function (frame) {
                console.log('Broker reported error: ' + frame.headers['message']);
                console.log('Additional details: ' + frame.body);
            },
        });

        setStompClient(client);

        // Aktivieren Sie den Client
        if (!client.active) {
            client.activate();
        }

        // Cleanup-Funktion
        return () => {
            if (client.connected) {
                client.deactivate();
            }
        }
    }, []);

    return (
        <StompClientContext.Provider value={{ stompClient, setStompClient }}>
            {children}
        </StompClientContext.Provider>
    );
}
