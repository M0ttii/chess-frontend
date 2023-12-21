'user client'
import { MoveInfo } from "@/model/MoveInfo";
import { Label } from "./ui/label";

interface MoveDetailsProps {
	info: MoveInfo;
}

const MoveDetails = (props: MoveDetailsProps) => {
	/*
	const renderLogs = () => {
		return props.info.log?.map((entry, i) => <li key={i} className="te ml-2">{entry}</li>);
	}
	*/

	const renderLogs = () => {
		return props.info.log?.map((entry, i) => {
			return <li key={i} className="mb-2 ms-4">   
				<div className="items-center justify-between p-2 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex bg-gray-700 border-gray-600">
					<div className="text-sm font-normal text-gray-300">{entry}</div>
				</div>
			</li>
		
		});
	}

	return (
		<div className="flex-row space-y-2">
			<h1 className="text-xl">Move</h1>
			{
				props.info.legal ?
				<div 
					className="text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-blue-200 text-blue-700 rounded-full"
				>legal</div>
				:
				<div 
					className="text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-red-200 text-red-700 rounded-full"
				>illegal</div>
			}
			<div className="text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 ml-1 bg-blue-200 text-blue-700 rounded-full">{props.info.move.moveType}</div>
			{/* <p className="font-bold">gameState: {props.info.gameState}</p> */}
			{/* add move and positions */}
			<p>{props.info.move.from.index} -&gt; {props.info.move.to.index} </p>
			<p>{!props.info.legal && <div className="font-bold">Error:</div>}{props.info.failMessage}</p>
			<p>Logs </p>
			<ol className="relative border-s border-gray-700 ml-2">
				{renderLogs()} 
			</ol>

			            
				
		</div>
	)
}

export default MoveDetails;