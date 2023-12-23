import { useStomp } from "@/ws/StompClientContext";
import { Chessboard } from "react-chessboard";
import { AbstractMessageModel, FenMessageModel } from "@/model/Debug";
import { DebugMoveModel } from "@/model/DebugMessage";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "./ui/use-toast";
import MoveDetails from "./MoveDetails";
import { MoveInfo } from "@/model/MoveInfo";
import ScenarioLoader from "./ScenarioLoader";
import Feed from "./Feed";
import GameService from "@/app/game";

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
    const [gameService, setGameService] = useState(new GameService(1)); // 0: Normal, 1: Freemode/Debug

    // const { startGame1 } = React.useContext(GameContext);

    // const stableCallback = useCallback(() => {
    //     console.log("test");
    // }, [])

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
                gameService.setStompClient(stompClient);
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
                console.log("[SUB::Move] Received message:", content);
                if (eventHandlers[content.id]) {
                    console.log("[SUB::Move] Found handler for message ID:", content.id);
                    eventHandlers[content.id](content);
                } else {
                    console.log("[SUB::Move] No handler found for message ID:", content.id);
                }
            });
            const subscription1 = stompClient.subscribe('/topic/debug/fen/', message => {
                var content = JSON.parse(message.body);
                console.log("[SUB:Fen] Received message:", content);
                if (eventHandlers[content.id]) {
                    console.log("[SUB:Fen] Found handler for message ID:", content.id);
                    eventHandlers[content.id](content);
                } else {
                    console.log("[SUB:Fen] No handler found for message ID:", content.id);
                }
            });

            const subscriptionGame = stompClient.subscribe('/topic/debug/game/', message => {
                var content = message.body;
                if (content == 'done') {
                    setIsGame(true);
                    // setGameFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
                    // setOldFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
                    setOldFen(gameFen);
                    console.log("[SUB:Game] 'done'");
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
        // gameService.startGame(gameFen);
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
        return gameService.executeMoveOnFen(fen, move);
    }
    
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

    // const handleFenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setInputFen(event.target.value); // Aktualisieren des Zustands mit dem neuen Wert
    // };

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
                console.log("[RCV::move] " + res.moveInfo.legal)
                console.log("updated move resp: any changes? ", res.moveInfo.stateFEN != gameFen)
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

    async function onSelection(fen: string) {
        if (fen.length != 0) {
            setGameFen(fen);
            // startGame();
            console.log("on selection: ", fen);
            gameService.startGame(fen);
        }
    }


    return (
        <div className="flex flex-wrap items-center justify-center space-y-2 h-screen bg-[#161618]">
            {/* <div className="flex-1 flex flex-col space-y-20 items-center justify-center"> */}
            <div className="flex flex-1 h-full items-center justify-center flex-col flex-wrap">
                <ScenarioLoader onSelection={onSelection}/>
               
                <div className="w-96 mt-8">
                    <Feed />
                </div>
                <div className="w-96 mt-8">
                    <MoveDetails info={moveInfo} />
                </div>
                <div className="grid grid-cols-2 gap-2 w-96 mt-8">
                    {/* <Button onClick={startGame}>Start Game</Button>
                    <Button onClick={startGame}>Reset Position</Button> */}
                </div>
            </div>
            <div className="flex items-center justify-center">
                <Chessboard boardWidth={700} onPieceDrop={onDrop} position={gameFen}></Chessboard>
            </div>
        </div>
    )
}