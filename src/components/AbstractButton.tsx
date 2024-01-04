
import React, { MouseEventHandler, ReactNode } from "react";
import { Button } from "./ui/button";
import Image from 'next/image'
import styles from '../app/styles.module.css'
import { cn } from "@/lib/utils";

interface AbstractButtonProps {
	content: string;
	children?: ReactNode;
	onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
}


const AbstractButton = ({ content, onClick, children }: AbstractButtonProps) => {
	return (



		<div className="relative group">
			{/* <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div> */}
			{/* <div className="absolute -inset-0.5 bg-gradient-to-r from-white to-white rounded-lg blur opacity-0 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-tilt"></div> */} 
			<Button variant="default" onClick={onClick} className={cn('h-40 w-40 rounded-[10px] hover:bg-transparent dark border border-solid border-[#2B2D32] hover:border-[#594DE5] [background:linear-gradient(90deg,rgba(40,43,51,0.94)_0%,rgb(23,24,29)_100%)] font-semibold text-white flex flex-col transform transition-transform duration-200 ease-in-out hover:scale-105')}>
				<div className="flex items-center justify-center pb-2">
					{children}
				</div>
				<div className="">{content}</div>
			</Button>
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


    <div className="w-[150px] h-[150px]">
      <div className="fixed w-[150px] h-[150px] top-0 left-0 rounded-[10px] border border-solid border-[#38393d63] [background:linear-gradient(180deg,rgb(47.75,50.86,60.18)_0%,rgb(47.75,50.86,60.18)_0.01%,rgba(47.75,50.86,60.18,0)_100%)]" />
    </div>


