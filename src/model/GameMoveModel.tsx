import { AbstractMessageModel } from "./Debug";

export class GameMoveModel extends AbstractMessageModel {
    move: string;
    gameId: string;
    playerId: string;
    promoteTo: number;

    constructor(id: number, move: string, promoteTo: number, gameId: string, playerId: string){
        super(id)
        this.move = move;
        this.gameId = gameId;
        this.playerId = playerId;
        this.promoteTo = promoteTo;
    }
}