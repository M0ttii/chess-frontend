import { useGame } from "@/app/gameCtx"
import * as React from 'react';
import { Chessboard } from "react-chessboard";
import ScenarioLoader from "../ScenarioLoader";
import MoveDetails from "../MoveDetails";
import Feed from "../Feed";
import { PromotionPieceOption } from "react-chessboard/dist/chessboard/types";
import { Separator } from "../ui/separator";
import localFont from 'next/font/local'
import { GameHistory } from "./GameHistory";
import { PlayerName } from "./PlayerName";
import { Time } from "./Time";
import { useRouter } from "next/navigation";
import { useState } from "react";


const myFont = localFont({
    src: '../../fonts/Supreme-Variable.ttf',
    display: 'swap',
})

const Game = () => {
    const { fen, execute, isBlackTimerRunning, isWhiteTimerRunning, moveHistory, blackPlayerId, whitePlayerId} = useGame();
    const router = useRouter();
    
    const [playerID, setPlayerID] = useState<string | null>(null);

    React.useEffect(() => {
        // Dieser Code wird nur im Browser ausgeführt, nicht beim Server-Side Rendering
        const storedPlayerID = localStorage.getItem("id");
        setPlayerID(storedPlayerID);
    }, []);

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

    const getBoardOrientation = () => {
        return playerID === whitePlayerId ? 'white' : 'black';
    };

    return (
        <>
            <div className="flex justify-center items-center h-screen rounded-lg space-x-4">
                <div className="flex space-x-5">
                    <div className="flex flex-col items-start">
                        <div className="flex w-full justify-between">
                            <PlayerName />
                            <Time initialTime={300000} isRunning={isBlackTimerRunning} ></Time>
                        </div>
                        <div className="flex space-x-5">
                            <div className="flex space-x-5 rounded-lg overflow-hidden border-[8px] border-[#1F1F1F]">

                                <Chessboard boardWidth={700} boardOrientation={getBoardOrientation()} position={fen} onPieceDrop={onDrop} customLightSquareStyle={{ backgroundColor: "#F2F2F2" }} customDarkSquareStyle={{ backgroundColor: "#848484" }} />
                            </div>
                        </div>
                        <div className="flex w-full justify-between pt-3">
                            <PlayerName />
                            <Time initialTime={300000} isRunning={isWhiteTimerRunning}></Time>
                        </div>
                    </div>
                    <GameHistory moveHistory={moveHistory}/>
                    {/* GameHistory neben dem Schachbrett */}
                </div>
            </div>



        </>
    )
}

export default Game;