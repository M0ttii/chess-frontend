export abstract class AbstractMessageModel {
    id: number;

    constructor(id: number){
        this.id = id;
    }
};

export type DebugModel = {
    fen: string
};

export enum Action{
    NEW_GAME,
    MOVE
};


export class FenMessageModel extends AbstractMessageModel {
    fen: string;

    constructor(id: number, fen: string) {
        super(id);
        this.fen = fen
    }
}

