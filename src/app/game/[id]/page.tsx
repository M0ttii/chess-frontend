'use client'
import { GameProvider } from "@/app/gameCtx";
import Game from "@/components/game/Game";

export default function Home() {
  return (
    <div className="h-full flex  items-center justify-center bg-[#121318]">
      <GameProvider>
        <Game />
      </GameProvider>
    </div>
  )
}
