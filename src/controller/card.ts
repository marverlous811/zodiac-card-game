export enum CardType {
    ZODIAC,
    PLANET,
    CHAR,
    EVENT
}

export class Card{
    private type : CardType | undefined;
    private name : string = '';
    private value: number = 0;

    constructor(name : string, value: number){
        this.name = name;
        this.value = value;
    }

    equalTo(card: Card){
        return this.name  === card.name 
            && this.type  === card.type
            && this.value === card.value
    }
}

export class PiecesCard{
    private listCard : Array<Card> = [];

    shuffle(){
        let counter = this.length;
        while(counter > 0){
            //pick a random index
            let index = Math.floor(Math.random() * counter);

            counter--;

            let temp = this.listCard[counter];
            this.listCard[counter] = this.listCard[index];
            this.listCard[index] = temp;
        }
    }

    addCard(card : Card){
        this.listCard.push(card);
    }

    popCard(){
        return this.listCard.pop();
    }

    get length(){
        return this.listCard.length;
    }

    get isEmpty(){
        return this.listCard.length === 0;
    }

    get list(){
        return this.listCard;
    }
}