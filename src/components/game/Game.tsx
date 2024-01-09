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
import { ResignDialog } from "./ResignDialog";


const myFont = localFont({
    src: '../../fonts/Supreme-Variable.ttf',
    display: 'swap',
})

const Game = () => {
    const { fen, execute, resign, setResign, isBlackTimerRunning, isWhiteTimerRunning, moveHistory, whitePlayerId, whiteTimeLeft, blackTimeLeft} = useGame();
    const router = useRouter();
    
    const [playerID, setPlayerID] = useState<string | null>(null);

    const [boardWidth, setBoardWidth] = useState(400);

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

    const adjustBoardWidth = () => {
        
        const maxWidth = 1000; // Maximale Größe des Schachbretts
        console.log("window.innerWidth: " + (window.innerWidth / 2 - 200))
        const width = Math.min((window.innerWidth / 2 - 200), maxWidth); // Berechne die neue Breite
        console.log("adjusting board width " + width)
        setBoardWidth(width); // Aktualisiere den State
    };

    React.useEffect(() => {
        window.addEventListener('resize', adjustBoardWidth);

        // Anfangsgröße einstellen
        adjustBoardWidth();

        // Event-Listener bei Unmount entfernen
        return () => window.removeEventListener('resize', adjustBoardWidth);
    }, []);

    const getBoardOrientation = () => {
        return playerID === whitePlayerId ? 'white' : 'black';
    };

    const isPlayerWhite = getBoardOrientation() === "white";

    return (
        <>
            <ResignDialog open={resign} setOpen={setResign}></ResignDialog>
            <div className="flex justify-center items-center h-screen rounded-lg space-x-4">
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
                    {/* GameHistory neben dem Schachbrett */}
                </div>
            </div>



        </>
    )
}

export default Game;