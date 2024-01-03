'use client'
import Game from "@/components/Game";
import { GameProvider } from "../gameCtx";

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
      <div className="flex w-full h-screen items-center justify-center">
        <GameProvider>
          <Game />
        </GameProvider>
      </div>
    )
  }