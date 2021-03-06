import { PiecesCard, Card } from "./card";
import { GameListener } from "./gameListener";
import { GAME_STATE } from "./gameAction";

class HandCard extends PiecesCard{
    getMaxValueCard(name: string){
        const list : Array<Card> = this.findCardsWithName(name);
        let maxValue = -1;

        for(let i = 0; i < list.length; i++){
            const card = list[i];
            if(card.value > maxValue){
                maxValue = card.value
            }
        }

        return maxValue;
    }
}

export default class Player{
    private _name: string;
    private hand: HandCard = new HandCard();
    private cardMap : Map<string, number> =  new Map();
    
    private isActive : boolean = false;
    private listener: GameListener | undefined;
    private _score: number;
    constructor(name: string){
        this._name = name;
        this._score = 0;
    }

    setListener(lisenter : GameListener){
        this.listener = lisenter
    }

    get name(){
        return this._name;
    }

    get score(){
        return this._score;
    }

    get handLength(){
        return this.hand.length;
    }

    get actived(){
        return this.isActive;
    }

    addCard(card: Card){
        this.hand.addCard(card);
        this.calculateScore(card);
    }

    calculateScore(card: Card){
        const name = card.name;
        const value = this.hand.getMaxValueCard(name);

        if(this.cardMap.has(name)){
            const oldValue = this.cardMap.get(name);
            this._score = this._score - (oldValue || 0);
        }

        this.cardMap.set(name, value);
        this._score += value;
    }

    addCards(listCard : Array<Card>){
        for(let i = 0; i < listCard.length; i++){
            const card = listCard[i];
            this.addCard(card);
        }
    }

    setActive(active: boolean){
        this.isActive = active;
    }

    draw(){
        if(!this.isActive) return;

        if(!this.listener) return;

        this.listener.changeState(GAME_STATE.PLAYER_DRAWING);
    }

    endTurn(){
        if(!this.isActive) return;

        if(!this.listener) return;

        this.listener.changeState(GAME_STATE.PLAYER_ENDTURN);
    }

    selectACard(listCard: Array<Card>, pos: number){
        if(pos >= listCard.length)
            return false;

        const cards = listCard.splice(pos, 1);
        if(cards.length === 0) {
            return false;
        }
        
        this.hand.addCard(cards[0]);
        if(this.listener) this.listener.changeState(GAME_STATE.STAND_BY);
        return true;
    }
}