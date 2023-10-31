'use client'
import Board from '@/components/Board'

export default function Home() {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="h-full w-full">
        <Board></Board>
      </div>
    </div>
  )
}
