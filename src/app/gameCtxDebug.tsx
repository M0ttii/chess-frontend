'use client'
import { 
	createContext, 
	useContext, 
	PropsWithChildren, 
	useState,
	useRef,
	useEffect 
} from "react";
import { toast } from "@/components/ui/use-toast";
import { AbstractMessageModel } from "@/model/Debug";

import { useStomp } from "@/ws/StompClientContext";
import { DebugMoveModel } from "@/model/DebugMessage";
import { DebugModel } from "@/model/Debug";
import { MoveInfo } from "@/model/MoveInfo";

/*
 * GameContextProps
 * 
 * Definiert die Eigenschaften des GameContext.
 */
interface GameContextProps {
	fen: string;
	setFen: React.Dispatch<React.SetStateAction<string>>;
	moves: MoveInfo[];
	getLastMove(): MoveInfo | null;
	createGame(): void;
	startGame(fen: string): void;
	load(fen: string): void;
	execute(move: string): void;
}

/*
 * GameContext
 * 
 * Definiert den GameContext, der die FEN-Position und die Liste der Züge
 * enthält.
 */
export const GameContext = createContext<GameContextProps>({
	fen: "",
	setFen: () => {},
	moves: [],
	// getLastMove: (): MoveInfo | null => {},
	getLastMove: () => {return null},
	createGame: () => {},
	startGame: (fen: string) => {},
	load: (fen: string) => {},
	execute: (move: string) => {}
});

export function useGame() {
	return useContext(GameContext);
}

/*
 * GameProvider
 * 
 * Stellt den GameContext für alle Komponenten bereit.
 */
export function GameProvider({ children }: PropsWithChildren) { 
	const [val, setVal] = useState("");
	const [stompConnected, setStompConnected] = useState(false);
	const eventHandlers: any = useRef({}).current;
	const [fen, setFen] = useState("");
	const [moves, setMoves] = useState<MoveInfo[]>([]);
	const [promoteTo, setPromoteTo] = useState(-1);
	const { stompClient } = useStomp();

	/*
	 * useEffect
	 * 
	 * Wird aufgerufen, wenn sich die stompClient-Referenz ändert.
	 * 
	 * Wenn stompClient nicht null ist, wird der Client aktiviert und die
	 * onConnect- und onDisconnect-Handler gesetzt.
	 */
	useEffect(() => {
		if (stompClient) {
            if (!stompClient.active) {
                stompClient.activate();
            }

            const onConnect = () => {
                console.log("STOMP: connected");
				setStompConnected(true);
            };

            const onDisconnect = () => {
                console.log('STOMP: disconnected');
				setStompConnected(false)
            };

            if (stompClient) {
                stompClient.onConnect = onConnect;
                stompClient.onDisconnect = onDisconnect;
            }

            // return () => {
            //     // Deaktivieren Sie stompClient nur, wenn es nicht null ist
            //     if (stompClient) {
            //         stompClient.deactivate();
            //     }
            // };
        
		}
	}, [stompClient]);


	/*
	 * useEffect
	 * 
	 * Wird aufgerufen, wenn sich die stompClient-Referenz ändert.
	 * 
	 * Wenn stompClient nicht null ist, wird der Client aktiviert und die
	 * onConnect- und onDisconnect-Handler gesetzt.
	 */

	useEffect(() => {
        if (stompConnected && stompClient) {
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
                    // setIsGame(true);
                    // setOldFen(gameFen);
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
		console.log("use effect handling subscriptions");
    }, [stompConnected, stompClient]);

	const createGame = () => {
		console.log("provider: create game");
		
	}

	/*
	 * startGame
	 * 
	 * Sendet eine Nachricht an den Server, um ein neues Spiel zu starten.
	 */
	async function startGame(fen: string) {
		console.log("provider: start game");
		if (stompClient && stompConnected) {
			var message: DebugModel = {
                fen: fen
            }
            stompClient.publish({ destination: '/debug/newgame', body: JSON.stringify(message) })
		}
	}

	/*
	 * load
	 * 
	 * Sendet eine Nachricht an den Server, um ein neues Spiel mit Start-FEN zu starten.
	 */
	const load = (fen: string) => {
		console.log("game: loading with", fen);
		if (stompClient && stompConnected) {
			var message: DebugModel = {
                fen: fen
            }
            stompClient.publish({ destination: '/debug/newgame', body: JSON.stringify(message) })
		}
		setFen(fen);
	}

	/*
	 * execute
	 * 
	 * Sendet eine Nachricht an den Server, um einen Zug auszuführen.
	 */
	
	const execute = (move: string) => {
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
    
        // Konvertierung des Arrays zurück in den FEN‚-String
        const newPosition = rows.map(row => row.replace(/1+/g, match => match.length.toString())).join("/");
    
        const newFen = `${newPosition} ${turn} ${castling} ${enPassant} ${halfMove} ${fullMove}`;

		console.log("Piece on square " + getPiece(move.split("-")[0]) )
		console.log("Target square" + to)

		var message: DebugMoveModel;
		message = {
            id:  Math.floor(Math.random() * 1000),
            move: move,
            promoteTo: -1
        }
		if(to[0] == 0 || to[0] == 7){
			if(getPiece(move.split("-")[0]) == "P" || getPiece(move.split("-")[0]) == "p"){
				console.log("Promotion");
				message = {
					id:  Math.floor(Math.random() * 1000),
					move: move,
					promoteTo: 1
				}
			}
		}

		sendAwaitResponse("/debug/move", message)
		.then((info: MoveInfo) => {
			console.log("resolve", info);
			if (info.legal) {
				setFen(newFen);
				moves.push(info);
			}
		})
		.catch(() => {
			console.log("send and await timed out");
		})
	}

	/*
	 * sendAwaitResponse
	 * 
	 * Sendet eine Nachricht an den Server und wartet auf eine Antwort.
	 * 
	 * Die Antwort wird als Promise zurückgegeben.
	 */
	function sendAwaitResponse(destination: string, message: AbstractMessageModel): Promise<MoveInfo> {
		return new Promise(async (resolve, reject) => {
            const messageId = message.id
			// register event handler
			eventHandlers[messageId] = (response: any) => {
                delete eventHandlers[messageId]; // remove handler after use
				const moveInfo: MoveInfo = response.moveInfo;
					resolve(moveInfo);
            };
			if (stompConnected) {
                stompClient?.publish({ destination: destination, body: JSON.stringify(message) });
            }
			setTimeout(() => {
                if (eventHandlers[messageId]) {
                    delete eventHandlers[messageId];
                    reject();
                }
            }, 30000); // 30 Sekunden Timeout
		});
	}

	/*
	 * getPiece
	 * 
	 * Gibt die Figur auf einem Feld aus dem FEN-String zurück.
	 */
	function getPiece(square: string) {
		const boardPosition = fen.split(" ")[0];
	
		const rows = boardPosition.split("/").map(row => row.replace(/\d/g, (match) => '1'.repeat(parseInt(match))));
	
		const file = square.charCodeAt(0) - 'a'.charCodeAt(0); 
		const rank = 8 - parseInt(square[1]); 
	
		const piece = rows[rank][file];
	
		return piece === '1' ? 'empty' : piece;
	}

	/*
	 * getLastMove
	 * 
	 * Gibt den letzten Zug zurück.
	 */
	const getLastMove=  (): MoveInfo | null => {
		const last = moves.at(0);
		if (last) {
			return last;
		}
		return null;
	}

	const replaceAt = (str: string, index: number, replacement: string) => {
        return str.substr(0, index) + replacement + str.substr(index + 1);
    }

	return (
		<GameContext.Provider value={{
			fen: fen,
			setFen: setFen,
			moves: moves,
			// stompClient: stompClient, 
			// setStompClient: setStompClient, 
			getLastMove: getLastMove,
			createGame: createGame,
			startGame: startGame,
			load: load,
			execute: execute
		}}>
				{ children }
		</GameContext.Provider>
	)
}