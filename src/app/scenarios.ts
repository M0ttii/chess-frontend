export type scenario = {
	name: string;
	fen: string;
}

export var scenarios: scenario[] = [
	{name: "Default", fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"},

	{name: "Scenario 1", fen: "7k/8/3b4/8/8/7P/8/7K w - - 0 1"},
	{name: "Default +1", fen: "rnbqkbnr/1ppppppp/8/p7/7P/8/PPPPPPP1/RNBQKBNR w KQkq - 0 1"},
	{name: "Castle 1", fen: "k7/8/6r1/8/8/8/8/P3K2R w - - 0 1"},
	{name: "Promotion", fen: "4k3/P7/8/8/8/8/8/K7 w - - 0 1"}
];