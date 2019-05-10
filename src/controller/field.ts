import { Card, CARD_TYPE } from "./card";
import { GAME_STATE } from "./gameAction";


export enum FIELD_STATE{
    NORMAL,    //Do all think
    NO_FILTER,  //No check has card name
    NO_TRIGGER, //No trigger card effect
    ADD_ONLY,   //only add card 
}

export class Field {
    private listCard: Array<Card> = [];
    private state : FIELD_STATE = FIELD_STATE.NORMAL;
    get list(){
        return this.listCard;
    }

    get length(){
        return this.listCard.length;
    }

    hasCardSameName(card: Card){
        let result = false;

        if(this.listCard.length == 0) return false;
        
        for(let i = 0; i < this.listCard.length; i++){
            const _card = this.listCard[i];
            if(_card.isTheSameName(card)){
                result = true;
                break;
            }
        }

        return result;

    }

    setState(state: FIELD_STATE){
        this.state = state;
    }

    push(card: Card){
        let gameState : GAME_STATE | undefined;

        switch(this.state){
            case FIELD_STATE.NORMAL:
                gameState = this.filter(card, this.trigger);
                break;
            case FIELD_STATE.NO_FILTER:
                gameState = this.add(card, this.trigger);
                break;
            case FIELD_STATE.NO_TRIGGER:
                gameState = this.filter(card);
                break;
            case FIELD_STATE.ADD_ONLY:
                gameState = this.add(card);
                break;
        }

        return gameState;
    }

    filter(card: Card, next?: (card: Card) => GAME_STATE){
        if(this.hasCardSameName(card)){
            // console.log("have the same card name");
            this.listCard.push(card);
            return GAME_STATE.SYS_ENDTURN;
        }

        return this.add(card, next);
    }

    add(card: Card, next?: (card: Card) => GAME_STATE){
        this.listCard.push(card);

        if(!next) return GAME_STATE.STAND_BY;

        return next(card);
    }

    trigger(card: Card){
        //TODO: add card effect here
        if(card.type === CARD_TYPE.PLANET){
            return GAME_STATE.STAND_BY;
        }

        // console.log("trigger a card effect");
        return GAME_STATE.SYS_TRIGGER;
    }

    spliceAllCard(){
        const list = this.listCard;
        this.listCard = [];

        return list;
    }
}