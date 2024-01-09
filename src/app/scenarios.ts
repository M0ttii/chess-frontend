export type scenario = {
	name: string;
	fen: string;
}

export var scenarios: scenario[] = [
	{name: "Default", fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"},
	{name: "Cap 1", fen: "k7/8/8/8/8/5p2/6p1/K6P w - - 0 1"},
	{name: "Scenario 1", fen: "7k/8/3b4/8/8/7P/8/7K w - - 0 1"},
	{name: "Default +1", fen: "rnbqkbnr/1ppppppp/8/p7/7P/8/PPPPPPP1/RNBQKBNR w KQkq - 0 1"},
	{name: "Castle 1", fen: "k7/8/6r1/8/8/8/8/P3K2R w - - 0 1"},
	{name: "Promotion", fen: "7k/P7/8/8/8/8/6p1/7K w - - 0 1"},

	// Move white rook to column of enemy king
	{name: "CM Anastasias Mate", fen: "8/4N1pk/8/8/8/4R3/8/K7 w - - 0 1"},
	// Move white rook somewhere in same row
	{name: "CM Arabian Mate", fen: "7k/R7/5N2/8/8/8/8/K7 w - - 0 1"},
	// Move queen to 63 (top right)
	{name: "CM Anderssens Mate", fen: "6k1/6P1/5K2/8/8/8/7Q/8 w - - 0 1"},
	// Move bishop to left to directly attack king
	{name: "CM Balestras Mate", fen: "4k3/8/5Q2/8/8/5B2/8/K7 w - - 0 1"}
];