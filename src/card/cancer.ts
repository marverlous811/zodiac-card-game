import { CardEffect } from "./effect";
import { ICardAction } from "../controller/game";
import { GAME_STATE } from "../controller/gameAction";
import { Card } from "../controller/card";

export class CancerEffect extends CardEffect{
    constructor(action: ICardAction){
        super(action);
    }

    action = (card: Card) => {
        let numberCard : Number = 0;
        switch(card.value){
            case 0: 
                numberCard = 3;
                break;
            case 5:
                numberCard = 2;
                break;
            case 10:
                numberCard = 1;
                break;
        }

        for(let i = 0; i < numberCard; i++){
            if(this.cardAction.deck.length === 0)
                break;
            
            const card = this.cardAction.deck.popCard();
            if(card) this.cardAction.cardTmp.push(card);
        }

        return GAME_STATE.WAIT_PLAYER_CHOICE;
    }
}