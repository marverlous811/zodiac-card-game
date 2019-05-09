import { PiecesCard, Card } from "./card";

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
    private listener: any;
    private _score: number;
    constructor(name: string, listener?: any){
        this._name = name;
        this.listener = listener;
        this._score = 0;
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
}