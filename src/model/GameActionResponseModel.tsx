import { AbstractMessageModel } from "./Debug";

export class GameActionResponseModel extends AbstractMessageModel {
    gameId: string;
    playerId: string;
    action: string;
    whoResigns: string;

    constructor(id: number, gameId: string, playerId: string, action: string, whoResigns: string){
        super(id)
        this.gameId = gameId;
        this.playerId = playerId;
        this.action = action;
        this.whoResigns = whoResigns;
    }
}