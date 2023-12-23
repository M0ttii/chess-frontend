import { useGame } from "@/app/gameCtx"
import * as React from 'react';
import { Chessboard } from "react-chessboard";
import ScenarioLoader from "./ScenarioLoader";

const Game = () => {
	const { fen, load, execute } = useGame();
	
	function onDrop(sourceSquare: any, targetSquare: any): boolean {
		var move = sourceSquare + "-" + targetSquare;
        execute(move);
		// add move history
		return true;
	}


	function onSelection(fen: string) {
		console.log("selection:", fen)
		load(fen);
    }

	return (
		<>
			<div className="flex flex-1 h-full items-center justify-center flex-col flex-wrap">
				<ScenarioLoader onSelection={onSelection}/>
			</div>

			<div className="flex flex-wrap items-center justify-center space-y-2 h-screen bg-[#161618]">
				<div className="flex items-center justify-center">
					<Chessboard boardWidth={700} onPieceDrop={onDrop} position={fen} />
				</div>
			</div>
		</>
	)
}

export default Game;