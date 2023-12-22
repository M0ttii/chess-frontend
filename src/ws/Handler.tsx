import { StompSubscription } from "@stomp/stompjs";
import { useStomp } from "./StompClientContext";
import { useCallback, useEffect, useState } from "react";

export function useRegisterCallback(route: string, eventHandler: any, userCallback: any) {
    const { stompClient } = useStomp();
    const [subscription, setSubscription] = useState<StompSubscription | null>(null);

    const stableUserCallback = useCallback(userCallback, [userCallback]);

    useEffect(() => {
        if (!stompClient || !stompClient.connected) {
            return;
        }

        // Wenn bereits eine Subscription existiert, erstelle keine neue
        if (subscription) {
            subscription.unsubscribe();
        }

        const newSubscription = stompClient.subscribe(route, message => {
            console.log("SubSub")
            var content = JSON.parse(message.body);
            console.log("Received message:", content);
            if (eventHandler[content.id]) {
                console.log("Found handler for message ID:", content.id);
                eventHandler[content.id](content);
            } else {
                console.log("No handler found for message ID:", content.id);
            }
            stableUserCallback(content);
        });

        setSubscription(newSubscription);

        // Clean up subscription on unmount oder bei Änderung der Abhängigkeiten
        return () => {
            newSubscription.unsubscribe();
            setSubscription(null);
        };
    }, [stompClient, route, stableUserCallback]);

    return subscription;
}



