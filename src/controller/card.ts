import { shuffleArray } from "../util";

export enum CARD_TYPE {
    ZODIAC,
    PLANET,
    CHAR,
    EVENT
}

export class Card{
    protected type : CARD_TYPE | undefined;
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

    isTheSameName(card: Card){
        return this.type === card.type
            && this.name === card.name
    }
}

export class ZodiacCard extends Card{
    constructor(name: string, value: number){
        super(name, value);
        this.type = CARD_TYPE.ZODIAC;
    }
}

export class PlanetCard extends Card{
    private protectionZodiac : Array<string> = [];
    constructor(name: string, value: number, listZodiac: Array<string>){
        super(name, value);
        this.type = CARD_TYPE.PLANET;
        this.protectionZodiac = listZodiac;
    }
}

export class PiecesCard{
    protected listCard : Array<Card> = [];

    shuffle(){
        this.listCard = shuffleArray(this.listCard);
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
    cardFactories : Map<CARD_TYPE, ICardFactory> = new Map();
    static instance : CardFactory;
    private constructor(){
        this.cardFactories.set(CARD_TYPE.ZODIAC, new ZodiacCardFactory());
        this.cardFactories.set(CARD_TYPE.PLANET, new PlanetCardFactory());
    }

    static getInstance(){
        if(!this.instance){
            this.instance = new CardFactory();
        }

        return this.instance;
    }

    makeCard(type: CARD_TYPE, name: string, value: number, ...option: any){
        const factory = this.cardFactories.get(type);
        if(!factory) return;

        const card = factory.createCard(name, value, ...option);

        return card;
    }
}