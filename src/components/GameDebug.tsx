import { useGame } from "@/app/gameCtxDebug"
import * as React from 'react';
import { Chessboard } from "react-chessboard";
import ScenarioLoader from "./game/ScenarioLoader";
import MoveDetails from "./game/MoveDetails";
import Feed from "./game/Feed";
import { PromotionPieceOption } from "react-chessboard/dist/chessboard/types";
import { Separator } from "./ui/separator";
import localFont from 'next/font/local'
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";


const myFont = localFont({
	src: '../fonts/Supreme-Variable.ttf',
	display: 'swap',
})

const DebugGame = () => {
	const { fen, load, execute, getLastMove, moveInfo } = useGame();


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
			<div className="flex justify-center items-center rounded-lg space-x-4">
				<div className="flex space-x-5">
					<div className="bg-[#1E1E2481] rounded-lg shadow-xl border border-[#242424] h-full">
						<div className="pl-3 pr-3 flex flex-1 h-full items-center pt-4 flex-col gap-4 flex-wrap">
							<div className="flex items-start pl-3">
								<Label className={cn(myFont.className, " text-[#A2A1A860]")}>Debug Mode</Label>
							</div>
							<ScenarioLoader onSelection={onSelection} />
							<Separator className="my-3 bg-white/30 rounded" />
							<MoveDetails info={moveInfo}></MoveDetails>
							<Feed />
						</div>
					</div>

					<div className="flex space-x-5">
						<div className="flex space-x-5 rounded-lg overflow-hidden border-[8px] border-[#1F1F1F]">
							<Chessboard boardWidth={800} onPieceDrop={onDrop} position={fen} customLightSquareStyle={{ backgroundColor: "#d0d0d0" }} customDarkSquareStyle={{ backgroundColor: "#3a3a3a" }} />
						</div>
					</div>
				</div>
			</div>


		</>
	)

	{/* <div className="flex justify-center items-center h-screen rounded-lg space-x-4">
                <div className="flex space-x-5">
                    <div className="flex flex-col items-start">
                        <div className="flex w-full justify-between">
                            <PlayerName />
                            <Time initialTime={300000} isRunning={isPlayerWhite ? isBlackTimerRunning : isWhiteTimerRunning} currentTime={isPlayerWhite ? blackTimeLeft : whiteTimeLeft} ></Time>
                        </div>
                        <div className="flex space-x-5">
                            <div className="flex space-x-5 rounded-lg overflow-hidden border-[8px] border-[#1F1F1F]">

                                <Chessboard boardWidth={boardWidth} boardOrientation={getBoardOrientation()} position={fen} onPieceDrop={onDrop} customLightSquareStyle={{ backgroundColor: "#F2F2F2" }} customDarkSquareStyle={{ backgroundColor: "#848484" }} />
                            </div>
                        </div>
                        <div className="flex w-full justify-between pt-3">
                            <PlayerName />
                            <Time initialTime={300000} isRunning={isPlayerWhite ? isWhiteTimerRunning : isBlackTimerRunning} currentTime={isPlayerWhite ? whiteTimeLeft : blackTimeLeft}></Time>
                        </div>
                    </div>
                    <GameHistory moveHistory={moveHistory}/>
                </div >
            </div > 
		*/}
}

export default DebugGame;