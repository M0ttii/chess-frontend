import { useStomp } from "@/ws/StompClientContext";
import { Chessboard } from "react-chessboard";
import { Button } from "./ui/button";
import { Action, DebugModel } from "@/model/Debug";
import { DebugMoveModel } from "@/model/DebugMessage";
import { useEffect, useRef, useState } from "react";
import { toast } from "./ui/use-toast";
import { randomInt, randomUUID } from "crypto";
import { v4 as uuidv4 } from 'uuid';
import { Input } from "./ui/input";
import MoveDetails from "./MoveDetails";
import { MoveInfo } from "@/model/MoveInfo";

export default function Board() {
    const { stompClient } = useStomp();
    const [isConnected, setIsConnected] = useState(false);
    const [isGame, setIsGame] = useState(false);
    const eventHandlers: any = useRef({});
    const [moveInfo, setMoveInfo] = useState({} as MoveInfo);
    const [fen, setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");

    useEffect(() => {
        // Überprüfen Sie, ob stompClient existiert, bevor Sie darauf zugreifen
        if (stompClient) {
            if (!stompClient.active) {
                stompClient.activate();
            }

            const onConnect = () => {
                setIsConnected(true);
                console.log('Stomp client connected');
            };

            const onDisconnect = () => {
                setIsConnected(false);
                console.log('Stomp client disconnected');
            };

            // Stellen Sie sicher, dass stompClient nicht null ist, bevor Sie Event-Handler zuweisen
            if (stompClient) {
                stompClient.onConnect = onConnect;
                stompClient.onDisconnect = onDisconnect;
            }

            return () => {
                // Deaktivieren Sie stompClient nur, wenn es nicht null ist
                if (stompClient) {
                    stompClient.deactivate();
                }
            };
        }
    }, [stompClient]);

    useEffect(() => {
        // Abonnieren Sie nur, wenn isConnected true ist und stompClient nicht null ist
        if (isConnected && stompClient) {
            const subscription = stompClient.subscribe('/topic/debug/move/', message => {
                var content = JSON.parse(message.body);
                console.log("Received message:", content);
                if (eventHandlers[content.id]) {
                    console.log("Found handler for message ID:", content.id);
                    eventHandlers[content.id](content);
                } else {
                    console.log("No handler found for message ID:", content.id);
                }
            });

            const subscriptionGame = stompClient.subscribe('/topic/debug/game/', message => {
                var content = message.body;
                if (content == 'done') {
                    setIsGame(true);
                    console.log("Nice");
                } else if (content == 'error') {
                    toast({

                        description: 'Game could not be created.'
                    })
                }
            });

            return () => {
                // Kündigen Sie das Abonnement nur, wenn subscription existiert
                if (subscription) {
                    subscription.unsubscribe();
                    subscriptionGame.unsubscribe();
                }
            };
        }
    }, [isConnected, stompClient]);
    //stompClient.publish({destination: '/app/test', body: JSON.stringify({'id': '123'})})
    //if(stompClient.connected)
    //stompClient.publish({destination: '/test', body: 'Message'})


    function startGame() {
        if (stompClient) {

            var message: DebugModel = {
                fen: ''
            }

            stompClient.publish({ destination: '/debug/newgame', body: JSON.stringify(message) })
        }
    }

    function sendAndReceive(message: DebugMoveModel) {
        return new Promise((resolve, reject) => {
            const messageId = message.id

            // Registrieren eines Event-Handlers für die Antwort
            console.log("Handler register")
            eventHandlers[messageId] = (response: any) => {
                delete eventHandlers[messageId]; // Handler entfernen, nachdem er verwendet wurde
                resolve(response); // Die Promise mit der Antwort auflösen
            };

            console.log("IDMESSAGE " + message.id)

            // Senden der Nachricht
            if (stompClient) {
                stompClient.publish({ destination: '/debug/move', body: JSON.stringify(message) });
            }
            // Optional: Timeout für die Antwort
            setTimeout(() => {
                if (eventHandlers[messageId]) {
                    delete eventHandlers[messageId];
                    reject(new Error("Timeout waiting for response"));
                }
            }, 30000); // 30 Sekunden Timeout
        });
    }

    function getRandomInt(max: any) {
        return Math.floor(Math.random() * max);
    }

    function loadFen(){
        if (stompClient) {

            var message: DebugModel = {
                fen: fen
            }

            stompClient.publish({ destination: '/debug/loadfen', body: JSON.stringify(message) })
        }
    }

    const handleFenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFen(event.target.value); // Aktualisieren des Zustands mit dem neuen Wert
    };

    function onDrop(sourceSquare: any, targetSquare: any) {
        if (!isGame) {
            console.log("No game")
            return false;
        }

        var move = sourceSquare + "-" + targetSquare;
        var message: DebugMoveModel = {
            id: getRandomInt(10000),
            move: move
        }
        sendAndReceive(message).then((res: any) => {
            setMoveInfo(res.moveInfo);
            if (res.moveInfo.legal) {
                console.log("Legal: " + res.moveInfo.legal)
                setFen(res.moveInfo.stateFEN)
                return true;
            }
        });

        return false;
    }


    return (
        <div className="flex items-center justify-center h-screen bg-[#161618]">
            <div className="flex-1 flex flex-col space-y-80 items-center justify-center">
                <div className="flex w-full max-w-sm items-center space-x-2">
                    <Input className="dark" type="email" placeholder="FEN" onSubmit={loadFen} />
                    <Button type="submit">Load</Button>
                </div>
                <div className="flex flex-col space-y-2">
                    <MoveDetails info={moveInfo} />

                    <Button onClick={startGame}>Start Game</Button>
                    <Button onClick={startGame}>Reset Position</Button>
                </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
                <Chessboard boardWidth={800} onPieceDrop={onDrop} position={fen}></Chessboard>
            </div>
        </div>

    )
}