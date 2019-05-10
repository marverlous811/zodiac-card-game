import { CardEffect } from "./effect";
import { ICardAction } from "../controller/game";
import { GAME_STATE } from "../controller/gameAction";

export class Taurus extends CardEffect{
    constructor(action : ICardAction){
        super(action);
    }

    action = () => {
        const listCard = this.cardAction.field.spliceAllCard();

        this.cardAction.cardTmp = listCard;
        
        return GAME_STATE.WAIT_PLAYER_CHOICE
    }
}