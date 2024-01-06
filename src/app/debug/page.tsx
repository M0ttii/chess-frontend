'use client'
import Game from "@/components/GameDebug";
import { GameProvider } from "../gameCtxDebug";
import DebugGame from "@/components/GameDebug";

export default function Home() {

    async function setupGame(){
        const gameCreateRes = await fetch("http://localhost:8080/game", {
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
      <div className="bg-[#111115]">
        <GameProvider>
          <DebugGame></DebugGame>
        </GameProvider>
      </div>
    )
  }