import { CardEffect } from "./effect";
import { FIELD_STATE } from "../controller/field";
import { GAME_STATE } from "../controller/gameAction";
import { Card } from "../controller/card";
import { ICardAction } from "../controller/game";

export class AriesEffect extends CardEffect{
    constructor(action : ICardAction){
        super(action);
    }

    action = () => {
        this.cardAction.changeFieldState(FIELD_STATE.NO_TRIGGER);
        let game_state = GAME_STATE.STAND_BY;
        for(let i = 0; i < 2; i++){
            if(this.cardAction.deck.length === 0){
                break;
            }
            const card = this.cardAction.deck.popCard();
            if(!card) break;
            // console.log("card getted", card);
            this.cardAction.cardTmp.push(card);
            const state = this.cardAction.field.push(card);
            // console.log(this.cardAction.field);
            if(state && state === GAME_STATE.SYS_ENDTURN){
                // console.log(card);
                game_state = state;
                // console.log(game_state);
                if(card.name === 'aries'){
                    this.ariesEffect(i+1);
                }
                break;
            }
        }

        return game_state;
    }

    ariesEffect(number: number){
        let temp = this.cardAction.field.spliceAllCard();
        if(temp.length <= number){
            this.cardAction.addCardForNowPlayer(temp);
            return;
        }

        let _tmp : Array<Card> = [];
        for(let i = 0; i < number; i++){
            const card = temp.pop();
            if(!card) break;

            _tmp.push(card);
        }

        this.cardAction.addCardForNowPlayer(_tmp);
        this.cardAction.sendCardToDust(temp);

        return;
    }
}