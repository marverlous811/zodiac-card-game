export enum CardType {
    ZODIAC,
    PLANET,
    CHAR,
    EVENT
}

export class Card{
    protected type : CardType | undefined;
    protected name : string = '';
    protected value: number = 0;

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

export class ZodiacCard extends Card{
    constructor(name: string, value: number){
        super(name, value);
        this.type = CardType.ZODIAC;
    }
}

export class PlanetCard extends Card{
    private protectionZodiac : Array<string> = [];
    constructor(name: string, value: number, listZodiac: Array<string>){
        super(name, value);
        this.type = CardType.PLANET;
        this.protectionZodiac = listZodiac;
    }
}

export class PiecesCard{
    protected listCard : Array<Card> = [];

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

interface ICardFactory{
    createCard: (name: string, value: number, ...option: any) => Card;
}

class ZodiacCardFactory implements ICardFactory{
    createCard(name : string, value: number){
        let card = new ZodiacCard(name, value);

        return card;
    }
}

class PlanetCardFactory implements ICardFactory{
    createCard(name : string, value: number, listZodiac: Array<string>){
        let card = new PlanetCard(name, value, listZodiac);

        return card;
    }
}

export class CardFactory{
    cardFactories : Map<CardType, ICardFactory> = new Map();
    static instance : CardFactory;
    private constructor(){
        this.cardFactories.set(CardType.ZODIAC, new ZodiacCardFactory());
        this.cardFactories.set(CardType.PLANET, new PlanetCardFactory());
    }

    static getInstance(){
        if(!this.instance){
            this.instance = new CardFactory();
        }

        return this.instance;
    }

    makeCard(type: CardType, name: string, value: number, ...option: any){
        const factory = this.cardFactories.get(type);
        if(!factory) return;

        const card = factory.createCard(name, value, ...option);

        return card;
    }
}