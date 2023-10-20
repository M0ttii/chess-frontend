'use client'
import Board from '@/components/Board'
import Image from 'next/image'
import { Chessboard } from 'react-chessboard'

export default function Home() {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="h-full w-full">
        <Board></Board>
      </div>
    </div>
  )
}
