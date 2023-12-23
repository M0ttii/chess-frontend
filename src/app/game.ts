import { Client } from "@stomp/stompjs";
import { DebugModel } from "@/model/Debug";


// TODO make this a react provider
class GameService {
	stompClient?: Client
	mode: number

	setStompClient(client: Client) {
		this.stompClient = client;
	}


	startGame(fen: string) {
		if (this.stompClient) {
			var message: DebugModel = {
                fen: fen
            }

            this.stompClient.publish({ destination: '/debug/newgame', body: JSON.stringify(message) })
		}
	}

	doSubscribes() {
		if (!this.stompClient) {
			return;
		}

		// if (this.mode == 1) { // Freemode
		// 	// TODO start game
			
		// 	const subscription = this.stompClient.subscribe('/topic/debug/move/', message => {
        //         var content = JSON.parse(message.body);
        //         console.log("[SUB::Move] Received message:", content);
        //         if (eventHandlers[content.id]) {
        //             console.log("[SUB::Move] Found handler for message ID:", content.id);
        //             eventHandlers[content.id](content);
        //         } else {
        //             console.log("[SUB::Move] No handler found for message ID:", content.id);
        //         }
        //     });


		// } else {
		// 	console.log("ERROR: Subscribes for normal 1v1 mode not implemented yet");
		// }
	}

	executeMoveOnFen(fen: string, move: string): string {
        // console.log("OldFen: " + oldFen);
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
        rows[from[0]] = this.replaceAt(rows[from[0]], from[1], '1');
        rows[to[0]] = this.replaceAt(rows[to[0]], to[1], piece);
    
        // Konvertierung des Arrays zurück in den FEN-String
        const newPosition = rows.map(row => row.replace(/1+/g, match => match.length.toString())).join("/");
    
        return `${newPosition} ${turn} ${castling} ${enPassant} ${halfMove} ${fullMove}`;
    }

	private replaceAt(str: string, index: number, replacement: string) {
        return str.substr(0, index) + replacement + str.substr(index + 1);
    }

	constructor (mode: number) {
		// 0: Normal, 1: Freemode
		this.mode = mode;
	}
}

export default GameService;

// https://stackoverflow.com/questions/57448790/background-service-using-react-hooks