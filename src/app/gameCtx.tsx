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
import { GameMoveModel } from "@/model/GameMoveModel";
import { usePathname, useRouter } from "next/navigation";
import { set } from "react-hook-form";

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
	execute(move: string): void;
	moveHistory: Array<Map<Date, MoveInfo>>;
	isWhiteTimerRunning: boolean;
	isBlackTimerRunning: boolean;
	whitePlayerId: string;
	blackPlayerId: string;
	whiteTimeLeft: number;
	blackTimeLeft: number;
}

/*
 * GameContext
 * 
 * Definiert den GameContext, der die FEN-Position und die Liste der Züge
 * enthält.
 */
export const GameContext = createContext<GameContextProps>({
	fen: "",
	setFen: () => { },
	moves: [],
	// getLastMove: (): MoveInfo | null => {},
	getLastMove: () => { return null },
	execute: (move: string) => { },
	moveHistory: [],
	isWhiteTimerRunning: false,
	isBlackTimerRunning: false,
	whitePlayerId: "",
	blackPlayerId: "",
	whiteTimeLeft: 300000,
	blackTimeLeft: 300000

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
	const eventHandlers: any = useRef({}).current;
	const [fen, setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 1 1");
	const [moves, setMoves] = useState<MoveInfo[]>([]);
	const [promoteTo, setPromoteTo] = useState(-1);
	const { stompClient, isConnected } = useStomp();
	const path = usePathname();
	const gameID = path.split("/").pop();

	const [moveHistory, setMoveHistory] = useState<Array<Map<Date, MoveInfo>>>([]);

	const [isWhiteTimerRunning, setIsWhiteTimerRunning] = useState(false);
	const [isBlackTimerRunning, setIsBlackTimerRunning] = useState(false);

	const [whiteTimeLeft, setWhiteTimeLeft] = useState(300000);
	const [blackTimeLeft, setBlackTimeLeft] = useState(300000);

	const [whitePlayerId, setWhitePlayerId] = useState("");
	const [blackPlayerId, setBlackPlayerId] = useState("");

	const startWhiteTimer = () => {
		setIsWhiteTimerRunning(true);
	}

	const stopWhiteTimer = () => {
		setIsWhiteTimerRunning(false);
	}

	const startBlackTimer = () => {
		setIsBlackTimerRunning(true);
	}

	const stopBlackTimer = () => {
		setIsBlackTimerRunning(false);
	}

	/*
	 * useEffect
	 * 
	 * Wird aufgerufen, wenn sich die stompClient-Referenz ändert.
	 * 
	 * Wenn stompClient nicht null ist, wird der Client aktiviert und die
	 * onConnect- und onDisconnect-Handler gesetzt.
	 */
	useEffect(() => {
		if (isConnected) {
			console.log("STOMP: connected");
		} else {
			console.log("stompClient is null or disconnected");
		}
	}, [isConnected]);

	useEffect(() => {
		const fetchGame = async () => {
		  try {
			const response = await fetch('http://localhost:8080/game/' + gameID); 
			if (response.ok) {
			  const data = await response.json();
			  console.log("LastMoveFen: " + data.game.lastMoveFen);
			  if(data != null){
				  setBlackPlayerId(data.blackPlayerId);
				  setWhitePlayerId(data.whitePlayerId);
				  if(data.game.lastMoveFen != null){
					setFen(data.game.lastMoveFen);
				  }
				  console.log("blackPlayerId: " + data.blackPlayerId);
				  console.log("whitePlayerId: " + data.whitePlayerId);
			  }
			} else {
			  throw new Error('Fehler beim Laden der Daten');
			}
		  } catch (error) {
			console.error('Fehler beim Laden der moveHistory:', error);
		  }
		};
	
		fetchGame();
	  }, []);

	useEffect(() => {
		const fetchMoveHistory = async () => {
		  try {
			const response = await fetch('http://localhost:8080/history/' + gameID); 
			if (response.ok) {
			  const data = await response.json();
			  if(data.length > 5){
				  setMoveHistory(data);
			  }
			} else {
			  throw new Error('Fehler beim Laden der Daten');
			}
		  } catch (error) {
			console.error('Fehler beim Laden der moveHistory:', error);
		  }
		};
	
		fetchMoveHistory();
	  }, []);


	/*
	 * useEffect
	 * 
	 * Wird aufgerufen, wenn sich die stompClient-Referenz ändert.
	 * 
	 * Wenn stompClient nicht null ist, wird der Client aktiviert und die
	 * onConnect- und onDisconnect-Handler gesetzt.
	 */

	useEffect(() => {
		if (isConnected && stompClient) {
			const subscription = stompClient.subscribe('/topic/game/move/', message => {
				var content = JSON.parse(message.body);
				console.log("[SUB::Move] Received message:", content);
				const moveInfo: MoveInfo = content.moveInfo;
				if (moveInfo.legal) {
					setWhiteTimeLeft(content.whiteTimeLeft);
					setBlackTimeLeft(content.blackTimeLeft);
					addMove(new Date(), moveInfo);
					const stateFen = moveInfo.stateFEN;
					setFen(stateFen.toString());
					if (moveInfo.playerColor == 1) {
						setIsWhiteTimerRunning(true);
						setIsBlackTimerRunning(false);
					}
					if (moveInfo.playerColor == 0) {
						setIsWhiteTimerRunning(false);
						setIsBlackTimerRunning(true);
					}
				}
				if (eventHandlers[content.id]) {
					console.log("[SUB::Move] Found handler for message ID:", content.id);
					eventHandlers[content.id](content);
				} else {
					console.log("[SUB::Move] No handler found for message ID:", content.id);
				}
			});
			return () => {
				// Kündigen Sie das Abonnement nur, wenn subscription existiert
				if (subscription) {
					subscription.unsubscribe();
				}
			};
		}
		console.log("use effect handling subscriptions");
	}, [isConnected, stompClient]);

	useEffect(() => {
		console.log("Aktualisierter whiteTimeLeft: " + whiteTimeLeft);
		console.log("Aktualisierter blackTimeLeft: " + blackTimeLeft);

		const whiteTimeInSeconds = whiteTimeLeft / 1000;

		const minutes = Math.floor(whiteTimeInSeconds / 60);
  		const seconds = whiteTimeInSeconds % 60;
		const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
		console.log("Aktualisiert White Minuten: " + formattedTime)
	}, [whiteTimeLeft, blackTimeLeft]);

	const createGame = () => {
		console.log("provider: create game");

	}
	
	const addMove = (moveDate: Date, moveInfo: MoveInfo) => {
		const newMoveMap = new Map<Date, MoveInfo>([[moveDate, moveInfo]]);
		setMoveHistory(prevMoveHistory => [...prevMoveHistory, newMoveMap]);
	}




/*
 * execute
 * 
 * Sendet eine Nachricht an den Server, um einen Zug auszuführen.
 */

function generateTempFen(move: string): { newFen: string, to: number[] } {
	console.log("execute", move);
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
	return {
		newFen: newFen,
		to: to
	};

}

const execute = (move: string) => {
	const { newFen, to } = generateTempFen(move);
	var message: GameMoveModel;
	message = {
		id: Math.floor(Math.random() * 1000),
		gameId: gameID!,
		playerId: localStorage.getItem("id")!,
		move: move,
		promoteTo: -1
	}
	if (to[0] == 0 || to[0] == 7) {
		if (getPiece(move.split("-")[0]) == "P" || getPiece(move.split("-")[0]) == "p") {
			console.log("Promotion");
			message = {
				id: Math.floor(Math.random() * 1000),
				playerId: localStorage.getItem("id")!,
				gameId: gameID!,
				move: move,
				promoteTo: 1
			}
		}
	}
	console.log("Message: ", message);

	if (isConnected) {
		stompClient?.publish({ destination: "/game/move", body: JSON.stringify(message) });
	}
	/* sendAwaitResponse("/game/move", message)
	.then((info: MoveInfo) => {
		console.log("resolve", info);
		if (info.legal) {
			setFen(newFen);
			moves.push(info);
		}
	})
	.catch(() => {
		console.log("send and await timed out");
	}) */
}

/*
 * sendAwaitResponse
 * 
 * Sendet eine Nachricht an den Server und wartet auf eine Antwort.
 * 
 * Die Antwort wird als Promise zurückgegeben.
 */
function sendAwaitResponse(destination: string, message: AbstractMessageModel): Promise<MoveInfo> {
	console.log("sendAwaitResponse", message);
	return new Promise(async (resolve, reject) => {
		const messageId = message.id
		// register event handler
		eventHandlers[messageId] = (response: any) => {
			delete eventHandlers[messageId]; // remove handler after use
			const moveInfo: MoveInfo = response.moveInfo;
			resolve(moveInfo);
		};
		if (isConnected) {
			console.log("publish")
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
const getLastMove = (): MoveInfo | null => {
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
		execute: execute,
		moveHistory: moveHistory,
		isWhiteTimerRunning: isWhiteTimerRunning,
		isBlackTimerRunning: isBlackTimerRunning,
		whitePlayerId: whitePlayerId,
		blackPlayerId: blackPlayerId,
		whiteTimeLeft: whiteTimeLeft,
		blackTimeLeft: blackTimeLeft,
	}}>
		{children}
	</GameContext.Provider>
)
}