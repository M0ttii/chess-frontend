export type MoveInfo = {
	legal: boolean;
	playerColor: number;
	gameState: string;
	move: Move;
	stateFEN: String;
	failMessage: String;
	log: String[];
}

export type Move =  {
	from: Position;
	to: Position;
	moveType: number;
};

export type Position = {
	index: number;
	pieceType: number;
	color: number;
}
