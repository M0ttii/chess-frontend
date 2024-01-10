'use client'
import { GameProvider } from "@/app/gameCtx";
import Game from "@/components/game/Game";
import styles from '../../styles.module.css'
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className={cn("h-full flex  items-center justify-center ", styles.rdgradient)}>
      <GameProvider>
        <Game />
      </GameProvider>
    </div>
  )
}
