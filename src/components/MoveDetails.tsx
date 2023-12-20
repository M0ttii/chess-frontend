'user client'
import { MoveInfo } from "@/model/MoveInfo";

interface MoveDetailsProps {
	info: MoveInfo;
}

const MoveDetails = (props: MoveDetailsProps) => {
	const renderLogs = () => {
		return props.info.log?.map((entry, i) => <li key={i}>{entry}</li>);
	}
	return (
		// <div className="w-full rounded-md border bg-transparent">
		<div>
			<h1>Move details</h1>
			<p>legal: {props.info.legal ? "yes" : "no"}</p>
			<p>color: {props.info.playerColor}</p>
			<p>gameState: {props.info.gameState}</p>
			{/* add move and positions */}
			<p>{!props.info.legal && "failure: "+props.info.failMessage}</p>
			<p>logs: {renderLogs()} </p>
		</div>
	)
}

export default MoveDetails;