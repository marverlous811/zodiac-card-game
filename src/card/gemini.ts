import { CardEffect } from "./effect";
import { ICardAction } from "../controller/game";
import { GAME_STATE } from "../controller/gameAction";

export class GeminiEffect extends CardEffect{
    constructor(action: ICardAction){
        super(action);
    }

    action = () => {
        const state = this.cardAction.giveForAll();
        if(state === false){
            return GAME_STATE.SYS_ENDGAME;
        }
        
        return GAME_STATE.STAND_BY;
    }
}