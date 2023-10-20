import { Chessboard } from "react-chessboard";

export default function Board(){
    return (
        <div className="flex items-center justify-center h-full bg-red-400">
            <div className="items-center justify-center">
                <Chessboard boardWidth={800}></Chessboard>
            </div>
        </div>
    )
}