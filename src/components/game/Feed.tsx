import { useGame } from "@/app/gameCtxDebug";

const items: string[] = ["Move A", "Move B", "Move C", "Move D", "Move E"]
const Feed = () => {
	const { moves } = useGame();

	return (
		<div className="w-full h-[340px] max-h-[340px] overflow-y-scroll">
			<h1 className="text-xl">History</h1>
			<ol className="overflow-y-scroll overflow-hidden space-y-0.5 border-s border-gray-700 ml-2 mt-2">
			{
				moves.map((entry, i) => (
					<li key={i} className="pt-1 ms-4">  
					{ i == items.length - 1 ?
						<div className="items-center justify-between p-2 border border-red-200 rounded-lg shadow-sm sm:flex dark border-gray-600">
							<div className="text-sm font-normal pl-1 text-gray-300">{entry.stateFEN}</div>
						</div>
						:
						<div className="items-center justify-between p-2 border border-gray-200 rounded-lg shadow-sm sm:flex dark border-gray-600">
							<div className="text-sm font-normal pl-1 text-gray-300">{entry.stateFEN}</div>
						</div>
					} 
					</li>
				))
			}
			</ol>
		</div>
		
	)
}

export default Feed;