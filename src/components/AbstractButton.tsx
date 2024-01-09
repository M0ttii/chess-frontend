
import React, { MouseEventHandler, ReactNode } from "react";
import { Button } from "./ui/button";
import Image from 'next/image'
import styles from '../app/styles.module.css'
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import localFont from "next/font/local";
import { Separator } from "./ui/separator";
import { Inter } from "next/font/google";

const myFont = localFont({
	src: '../fonts/Supreme-Variable.ttf',
	display: 'swap',
	weight: '600'
})

const interFont = Inter({ subsets: ['latin'], weight: '500' })
interface AbstractButtonProps {
	title: string
	type: string
	content: string;
	children?: ReactNode;
	onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
}


const AbstractButton = ({ content, onClick, children, title, type }: AbstractButtonProps) => {
	const isDefault = type == "blue" ? true : false;
	const isFreeMode = title == "Free Mode" ? true : false;
	if (isDefault) {
		return (
			<div className="relative group">
				<div className="rounded-lg [background:linear-gradient(90deg,_rgba(79,_56,_218,_0.43),_rgba(94,_18,_191,_0.54))] shadow-[0px_5px_21.9px_rgba(0,_0,_0,_0.25)] w-[340px] h-[220px]">
					<div className="flex h-full items-center justify-center">
						<div className="flex  h-full w-full items-center justify-start pl-5">
							{isFreeMode 
							? 
							<div className="flex flex-col w-40 text-wrap">
								<Label className={cn(myFont.className, " text-4xl fg-opacity-10")}>{title}</Label>
								<Separator className="bg-white bg-opacity-30 w-40 rounded my-2 "></Separator>
								<div className="w-52">

									<Label className={cn(interFont.className, " text-sm opacity-80")}>Create a new Lobby and share your Game Code</Label>
								</div>
							</div>
							:
							<div className="flex flex-col w-52 text-wrap">
								<Label className={cn(myFont.className, " text-4xl fg-opacity-10")}>{title}</Label>
								<Separator className="bg-white bg-opacity-30 w-40 rounded my-2 "></Separator>
								<div className="w-52">

									<Label className={cn(interFont.className, " text-sm opacity-80")}>Create a new Lobby and share your Game Code</Label>
								</div>
							</div>
							}

						</div>
						<div className="absolute top-[-115px] scale-[0.6] translate-x-32">
							<Image className="" src="/king.png" width={600} height={600} alt="s" />
						</div>
					</div>
				</div>

			</div>
		);
	}
	return (
		<div className="relative group">
			<div className="rounded-lg [background:linear-gradient(90deg,_rgba(56,_218,_150,_0.43),_rgba(18,_191,_149,_0.54))] shadow-[0px_5px_21.9px_rgba(0,_0,_0,_0.25)] w-[340px] h-[220px]">
				<div className="flex h-full items-center justify-center">
					<div className="flex  h-full w-full items-center justify-start pl-5">
						<div className="flex flex-col w-40 text-wrap">
							<Label className={cn(myFont.className, " text-4xl fg-opacity-10")}>{title}</Label>
							<Separator className="bg-white bg-opacity-30 w-40 rounded my-2 "></Separator>
							<div className="w-52">

								<Label className={cn(interFont.className, " text-sm opacity-80")}>Create a new Lobby and share your Game Code</Label>
							</div>
						</div>
						
					</div>
					<div className="absolute top-[-140px] scale-[0.6] translate-x-32">
							<Image className="" src="/king-green.png" width={800} height={800} alt="s" />
						</div>
				</div>
			</div>

		</div>

		// <div className="relative group">
		// 	<div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
		// 	<Button variant="default" onClick={onClick} className={cn('h-40 w-40 rounded-lg bg-zinc-900 leading-none relative divide-x font-semibold text-white flex flex-col hover:bg-zinc-900 gradient-border', styles.gradient)}>
		// 		<div className="flex items-center justify-center pb-2">
		// 			{children}
		// 		</div>
		// 		<div className="">{content}</div>
		// 	</Button>
		// </div>
	);
};

export default AbstractButton;


{/* <div className="w-[150px] h-[150px]">
      <div className="fixed w-[150px] h-[150px] top-0 left-0 rounded-[10px] border border-solid border-[#38393d63] [background:linear-gradient(180deg,rgb(47.75,50.86,60.18)_0%,rgb(47.75,50.86,60.18)_0.01%,rgba(47.75,50.86,60.18,0)_100%)]" />
    </div> */}


