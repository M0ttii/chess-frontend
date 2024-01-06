
import React, { MouseEventHandler, ReactNode } from "react";
import { Button } from "./ui/button";
import Image from 'next/image'

interface AbstractButtonProps {
	content: string;
	children?: ReactNode;
	onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
}


export const MenuHistory = () => {
	return (
		<div className="w-full h-60 bg-[#161515] rounded-lg bg-[#161515]"></div>
	);
};

