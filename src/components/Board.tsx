import { useStomp } from "@/ws/StompClientContext";
import { Chessboard } from "react-chessboard";
import { Button } from "./ui/button";
import { AbstractMessageModel, Action, DebugModel, FenMessageModel } from "@/model/Debug";
import { DebugMoveModel } from "@/model/DebugMessage";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "./ui/use-toast";
import { randomInt, randomUUID } from "crypto";
import { v4 as uuidv4 } from 'uuid';
import { Input } from "./ui/input";
import MoveDetails from "./MoveDetails";
import { MoveInfo } from "@/model/MoveInfo";
import { useRegisterCallback } from "@/ws/Handler";

export default function Board() {
    const { stompClient } = useStomp();
    const [isConnected, setIsConnected] = useState(false);
    const [isGame, setIsGame] = useState(false);
    const eventHandlers: any = useRef({}).current;
    const [moveInfo, setMoveInfo] = useState({} as MoveInfo);
    const [inputFen, setInputFen] = useState("");
    const [gameFen, setGameFen] = useState("");
    const [oldFen, setOldFen] = useState("");
    const moveHistory: { fen: string; move: string; }[] = [];


    const stableCallback = useCallback(() => {
        console.log("test");
    }, [])

    // const subscription = useRegisterCallback('/topic/debug/move/', eventHandlers, stableCallback);

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
            startGame();
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
            const subscription1 = stompClient.subscribe('/topic/debug/fen/', message => {
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
                    setGameFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
                    setOldFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
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
                    subscription1.unsubscribe();
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

    

    function sendAndReceiveGeneric(destination: string, message: AbstractMessageModel) {
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
                stompClient.publish({ destination: destination, body: JSON.stringify(message) });
            }

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

    function executeMoveOnFen(fen: string, move: string) {
        console.log("OldFen: " + oldFen);
        // Zerlegen des FEN-Strings in seine Hauptkomponenten
        let [position, turn, castling, enPassant, halfMove, fullMove] = fen.split(" ");
    
        // Umwandlung der Brett-Position in ein zweidimensionales Array
        const rows = position.split("/").map(row => row.replace(/[1-8]/g, (match) => '1'.repeat(parseInt(match))));
    
        // Umwandlung der Schachzug-Notation (z.B. e2-e4) in Array-Indizes
        const [from, to] = move.split("-").map(notation => {
            const file = notation.charCodeAt(0) - 'a'.charCodeAt(0);
            const rank = 8 - parseInt(notation[1]);
            return [rank, file];
        });
    
        // Ausführen des Zuges: Figur verschieben und Zielposition leeren
        const piece = rows[from[0]][from[1]];
        rows[from[0]] = replaceAt(rows[from[0]], from[1], '1');
        rows[to[0]] = replaceAt(rows[to[0]], to[1], piece);
    
        // Konvertierung des Arrays zurück in den FEN-String
        const newPosition = rows.map(row => row.replace(/1+/g, match => match.length.toString())).join("/");
    
        return `${newPosition} ${turn} ${castling} ${enPassant} ${halfMove} ${fullMove}`;
    }
    
    function replaceAt(str: string, index: number, replacement: string) {
        return str.substr(0, index) + replacement + str.substr(index + 1);
    }
    
    // Beispielverwendu
    

    function loadFen(){
        console.log("InputFen: "  + inputFen)
        if (stompClient) {
            const fenMsg = new FenMessageModel(
                getRandomInt(1000),
                inputFen
            )

            sendAndReceiveGeneric('/debug/loadfen', fenMsg).then((res: any) => {
                console.log("Fen: " + res.fen);
                setGameFen(res.fen);
                setOldFen(res.fen);
            })
        }
    }

    const handleFenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputFen(event.target.value); // Aktualisieren des Zustands mit dem neuen Wert
    };

    function onDrop(sourceSquare: any, targetSquare: any) {
        if (!isGame) {
            console.log("No game")
            return false;
        }

        var move = sourceSquare + "-" + targetSquare;
        var message: DebugMoveModel = {
            id: getRandomInt(10000),
            move: move,
            promoteTo: -1
        }
        const tempFen = executeMoveOnFen(gameFen, move)
        moveHistory.push({fen: gameFen, move: move})

        setGameFen(tempFen)

        sendAndReceiveGeneric("/debug/move", message).then((res: any) => {
            setMoveInfo(res.moveInfo);
            if (res.moveInfo.legal) {
                console.log("Legal: " + res.moveInfo.legal)
                setGameFen(res.moveInfo.stateFEN)
                return true;
            } else {
                if(moveHistory.length === 0){
                    return;
                }
                const lastMove = moveHistory.pop();
                if(lastMove) setGameFen(lastMove.fen);
                return false
            }
        });

        return false;
    }


    return (
        <div className="flex flex-wrap items-center justify-center space-y-2 h-screen bg-[#161618]">
            <div className="flex-1 flex flex-col space-y-20 items-center justify-center">
                <div className="flex w-full max-w-sm items-center">
                    {/*  space-x-2 */}
                    <Input className="dark" type="email" onChange={handleFenChange} placeholder="FEN"/>
                    <Button type="submit" onClick={loadFen}>Load</Button>
                </div>
                <div className="w-10/12">
                    <MoveDetails info={moveInfo} />
                </div>
                <div className="flex flex-col space-y-2">
                    <Button onClick={startGame}>Start Game</Button>
                    <Button onClick={startGame}>Reset Position</Button>
                </div>
            </div>
            <div className="flex items-center justify-center bg-green-200">
                <Chessboard boardWidth={600} onPieceDrop={onDrop} position={gameFen}></Chessboard>
            </div>
        </div>

    )
}