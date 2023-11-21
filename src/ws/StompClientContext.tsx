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
    setStompClient: () => {},
});

export function useStomp(){
    return useContext(StompClientContext);
}

export function StompClientProvider({children}: ScriptProps) {
    const [stompClient, setStompClient] = useState<Client | null>(null);
    console.log("Test")
    useEffect(() => {
        const sockJS = new SockJS("http://localhost:8080/test");
        const client = Stomp.over(sockJS);
        setStompClient(client);

        return () => {
            if(client && client.connected){
                client.disconnect();
            }
        }
    }, []);

    return (
        <StompClientContext.Provider value={{stompClient, setStompClient}}>
            {children}
        </StompClientContext.Provider>
    )
}