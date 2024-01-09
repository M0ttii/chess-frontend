import { MoveInfo } from "./MoveInfo";

export type GameHistory = {
    gameId: string;
    moveHistory: Array<Map<Date, MoveInfo>>;
}