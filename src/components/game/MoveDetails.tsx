'user client'
import { MoveInfo } from "@/model/MoveInfo";
import { useEffect } from "react";

interface MoveDetailsProps {
	info: MoveInfo | null;
}

const MoveDetails = (props: MoveDetailsProps) => {

	useEffect(() => {
		console.log("MOVE DETAILS CHANGED; ", props.info);
	}, [props.info]);

	const renderLogs = () => {
		return props.info?.log?.map((entry, i) => {
			return <li key={i} className="mb-2 ms-4">   
				<div className="items-center justify-between p-2 border border-gray-200 rounded-lg shadow-sm sm:flex dark border-gray-600">
					<div className="text-sm font-normal text-gray-300">{entry}</div>
				</div>
			</li>
		
		});
	}

	const renderMove = () => {
		return <>
			{
				props.info?.legal ?
				<div 
					className="text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-blue-300 text-blue-700 rounded-full"
				>legal</div>
				:
				<div 
					className="text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-red-300 text-red-700 rounded-full"
				>illegal</div>
			}
			<div className="text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 ml-2 bg-gray-200 text-black rounded-full">{props.info?.move.moveType}</div>
			<p>{!props.info?.legal && <span className="font-bold">Error: </span>}{props.info?.failMessage}</p>
			<p>{props.info?.move.from.index} -&gt; {props.info?.move.to.index}[{props.info?.move.to.color}]</p>
			<p>Logs</p>
			<ol className="relative border-s border-gray-700 ml-2">
				{renderLogs()} 
			</ol>
		</>
	}

	return (
		<div className="flex-row space-y-2 w-96">
			<h1 className="text-xl">Move</h1>
				{props.info?.move ? 
					renderMove() 
					: 
					<p className="italic text-sm">No moves yet</p>
				}
			
		</div>
	)
}

export default MoveDetails;