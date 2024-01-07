
import React, { MouseEventHandler, ReactNode } from "react";
import { Button } from "../ui/button";
import Image from 'next/image'
import localFont from "next/font/local";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { Move, MoveInfo } from "@/model/MoveInfo";

interface AbstractButtonProps {
	content: string;
	children?: ReactNode;
	onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
}

interface GameHistoryProps {
	moveHistory: Map<Date, MoveInfo>[]
}

const myFont = localFont({
	src: '../../fonts/Supreme-Variable.ttf',
	display: 'swap',
	weight: '700',
})


export const GameHistory = (props: GameHistoryProps) => {
	const moveHistory = props.moveHistory;

	const sortMoveHistory = (moveHistory: Map<Date, MoveInfo>[]) => {
		return moveHistory.sort((a, b) => {
			const dateA = Array.from(a.keys())[0];
			const dateB = Array.from(b.keys())[0];

			if (dateA > dateB) return 1;
			if (dateA < dateB) return -1;
			return 0;
		});
	};

	function convertIndexToChessNotation(index: number) {
		const row = Math.floor(index / 8);
		const column = index % 8;
		const columnLetter = String.fromCharCode('a'.charCodeAt(0) + column);
		const rowNumber = row + 1;
		return columnLetter + rowNumber;
	}
	
	function getMoveString(move: Move) {
		return convertIndexToChessNotation(move.from.index) + "-" + convertIndexToChessNotation(move.to.index);
	}


	return (
		<div className="bg-[#1E1E2481] rounded-lg shadow-xl border border-[#242424]">
			<div className="w-60 flex flex-1 h-full pt-4 flex-col justify-between gap-4 flex-wrap">
				<div className="">

					<div className="flex items-start pl-3">
						<Label className={cn(myFont.className, " text-[#A2A1A860]")}>History</Label>
					</div>
					<div className="flex items-center flex-col space-y-2 p-3">
						{sortMoveHistory(moveHistory).map((moveInfo, index) => {
							const move = Array.from(moveInfo.values())[0];
							const moveString = getMoveString(move.move);
							return (
								<div key={index} className="flex space-x-2 justify-center items-center w-full bg-[#0B0C0F] h-8 rounded-lg">
									<Label className={cn(myFont.className, "text-[#A2A1A8] text-sm")}>{moveString}</Label>
								</div>
							);
						})}
					</div>
					{/* <div className="flex items-center flex-col space-y-2">
						{sortMoveHistory(moveHistory).map((moveInfo, index) => {
							const date = Array.from(moveInfo.keys())[0];
							const move = Array.from(moveInfo.values())[0];
							return (
								<div key={index} className="flex space-x-2 items-center">
									<Label className={cn(myFont.className, "text-[#A2A1A860] text-sm")}>{moveInfo.}</Label>
								</div>
							);
						})}
					</div> */}
				</div>
				<div className="flex p-3 space-x-2 justify-center">
					<Button className="w-full">Remis</Button>
					<Button className="w-full bg-[#E05E5E] text-white">Surrender</Button>
				</div>
			</div>
		</div>
	);
};

