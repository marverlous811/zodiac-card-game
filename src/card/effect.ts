import { ICardAction } from "../controller/game";
import { GAME_STATE } from "../controller/gameAction";

export abstract class CardEffect{
    protected cardAction: ICardAction;
    constructor(action : ICardAction){
        this.cardAction = action;
    }

    abstract action(...options: any) : GAME_STATE;
}