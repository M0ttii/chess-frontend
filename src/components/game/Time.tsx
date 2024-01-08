import { Roboto, Roboto_Mono } from "next/font/google";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export const roboto_mono = Roboto({
	subsets: ['latin'],
	display: 'swap',
	weight: '700',
})

interface TimeProps {
	initialTime: number;
	isRunning: boolean;
	currentTime: number;
}

export const Time = (props: TimeProps) => {

	const initialTimeInSeconds = Math.floor(props.initialTime / 1000);
	const [time, setTime] = useState(initialTimeInSeconds);

	useEffect(() => {
		if (props.currentTime !== undefined) {
			setTime(Math.floor(props.currentTime / 1000));
		}
	}, [props.currentTime]);

	useEffect(() => {
		let timer: any;
		if (props.isRunning) {
			timer = setInterval(() => {
				setTime(prevTime => prevTime - 1);
			}, 1000);
		} else {
			clearInterval(timer);
		}

		return () => clearInterval(timer);
	}, [props.isRunning]);

	const minutes = Math.floor(time / 60);
	const seconds = time % 60;

	const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

	return (
		<div className="w-[100px] h-[41px]">
			<div className="fixed w-[102px] h-[41px]">
				{props.isRunning
					? <div className="w-[100px] h-[41px] bg-[#1c1c22] border-2 border-white rounded-[5px] items-center flex justify-center">
						<Label className={cn(roboto_mono.className, " text-xl text-[#ffffff80]")}>{formattedTime}</Label>
						</div>
					: <div className="w-[100px] h-[41px] bg-[#1c1c22]  rounded-[5px] items-center flex justify-center">
					<Label className={cn(roboto_mono.className, " text-xl text-[#ffffff80]")}>{formattedTime}</Label>
					</div>
				}
			</div>
		</div>
	);
};