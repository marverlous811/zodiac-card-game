import { PiecesCard, Card } from "./card";

export default class Player{
    private id: number = 0;
    private name: string;
    private hand: PiecesCard = new PiecesCard();
    private isActive : boolean = false;
    private listener: any;
    constructor(name: string, listener: any){
        this.name = name;
        this.listener = listener;
    }

    getName(){
        return this.name;
    }

    addCard(card: Card){
        this.hand.addCard(card);
    }

    draw(){
    }

    setActive(active: boolean){
        this.isActive = active;
    }
}