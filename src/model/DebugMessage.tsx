import { UUID } from "crypto";
import { AbstractMessageModel } from "./Debug";



export class DebugMoveModel extends AbstractMessageModel {
    move: string;
    promoteTo: number;

    constructor(id: number, move: string, promoteTo: number){
        super(id)
        this.move = move;
        this.promoteTo = promoteTo;
    }
}

