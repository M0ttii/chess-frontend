
import React, { MouseEventHandler, ReactNode } from "react";
import { Button } from "../ui/button";
import Image from 'next/image'
import localFont from "next/font/local";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

interface AbstractButtonProps {
	content: string;
	children?: ReactNode;
	onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
}

const myFont = localFont({
    src: '../../fonts/Supreme-Variable.ttf',
    display: 'swap',
    weight: '700',
  })


export const GameHistory = () => {
	return (
		<div className="bg-[#1E1E2481] rounded-lg shadow-xl border border-[#242424]">
			<div className="w-60 flex flex-1 h-full pt-4 flex-col justify-between gap-4 flex-wrap">
				<div className="flex items-start pl-3">
					<Label className={cn(myFont.className, " text-[#A2A1A860]")}>History</Label>
				</div>
				<div className="flex p-3 space-x-2 justify-center">
					<Button className="w-full">Remis</Button>
					<Button className="w-full bg-[#E05E5E] text-white">Surrender</Button>
				</div>
			</div>
		</div>
	);
};

