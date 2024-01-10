'use client'
import Game from "@/components/GameDebug";
import { GameProvider } from "../gameCtxDebug";
import DebugGame from "@/components/GameDebug";

export default function Home() {

    async function setupGame(){
        const gameCreateRes = await fetch(process.env.NEXT_PUBLIC_HOST + "/game", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ player1: localStorage.getItem("id"), player2: "1"})
            });

            
            const gameCreateResData = await gameCreateRes.json();
            const gameID = gameCreateResData.id;
    }

    return (
      <div className="h-full flex  items-center justify-center bg-[#121318]">
        <GameProvider>
          <DebugGame></DebugGame>
        </GameProvider>
      </div>
    )
  }