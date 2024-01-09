import { AbstractMessageModel } from "./Debug";

export class GameActionModel extends AbstractMessageModel {
    gameId: string;
    playerId: string;
    action: string;

    constructor(id: number, gameId: string, playerId: string, action: string){
        super(id)
        this.gameId = gameId;
        this.playerId = playerId;
        this.action = action;
    }
}