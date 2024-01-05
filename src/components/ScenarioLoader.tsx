import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { scenarios } from "@/app/scenarios";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import * as React from 'react';
import { useGame } from "@/app/gameCtxDebug";

interface ScenarioLoaderProps {
	onSelection: (fen: string) => void
}

const ScenarioLoader = (props: ScenarioLoaderProps) => {
	const [input, setInput] = useState("");

    const {load} = useGame();


	const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		// TODO add delay
		setInput(event.target.value);
	}

	const onScenarioSelection = (fen: string) => {
		setInput(fen);
	}

	const onClick = () => {
		props.onSelection(input);
	}

	return (
		<div className="grid grid-cols-2 gap-2 w-96">
			<Input className="dark border-zinc-600 focus:outline-none focus:border-[#7373FF]  col-span-2" type="email" onChange={onChange} placeholder="FEN string" value={input} />
			<Select onValueChange={onScenarioSelection} >
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Placeholder" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{
							scenarios.map((scenario, i) => (
								<SelectItem
									key={i}
									value={scenario.fen}
								>
									{scenario.name}
								</SelectItem>
							))
						}
					</SelectGroup>
				</SelectContent>
			</Select>
			<Button type="submit" onClick={onClick}>Load</Button>
		</div>
	)

}

export default ScenarioLoader;