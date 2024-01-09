import { useGame } from "@/app/gameCtxDebug"
import * as React from 'react';
import { Chessboard } from "react-chessboard";
import ScenarioLoader from "./game/ScenarioLoader";
import MoveDetails from "./game/MoveDetails";
import Feed from "./game/Feed";
import { PromotionPieceOption } from "react-chessboard/dist/chessboard/types";
import { Separator } from "./ui/separator";
import localFont from 'next/font/local'


const myFont = localFont({
	src: '../fonts/Supreme-Variable.ttf',
	display: 'swap',
  })

const DebugGame = () => {
	const { fen, load, execute, getLastMove } = useGame();

	
	function onDrop(sourceSquare: any, targetSquare: any): boolean {
		console.log("Piece dropped")
		var move = sourceSquare + "-" + targetSquare;
		execute(move);
		// add move history
		return true;
	}

	function test(piece: PromotionPieceOption | undefined): boolean {
		console.log(piece);
		return true;

	}


	function onSelection(fen: string) {
		console.log("selection:", fen)
		load(fen);
	}

	return (
		<>
			<div className="flex rounded-lg space-x-4">
				<div className="bg-zinc-900 rounded-lg shadow-xl border-1">
					<div className="pl-3 pr-3 flex flex-1 h-full items-center pt-4 flex-col gap-4 flex-wrap">
						<ScenarioLoader onSelection={onSelection} />
						<Separator className="my-3 bg-white/30 rounded" />
						<MoveDetails info={getLastMove()}></MoveDetails>
						<Feed />
					</div>
				</div>

				<div className="rounded-lg overflow-hidden">
					<Chessboard boardWidth={800} onPieceDrop={onDrop} position={fen} customLightSquareStyle={{ backgroundColor: "#d0d0d0" }} customDarkSquareStyle={{ backgroundColor: "#3a3a3a" }} />
				</div>
			</div>


		</>
	)
}

export default DebugGame;