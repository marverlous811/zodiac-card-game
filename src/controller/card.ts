import { shuffleArray } from "../util";

export enum CARD_TYPE {
    ZODIAC,
    PLANET,
    CHAR,
    EVENT
}

export class Card{
    protected _type : CARD_TYPE | undefined;
    protected _name : string = '';
    protected _value: number = 0;

    constructor(name : string, value: number){
        this._name = name;
        this._value = value;
    }

    equalTo(card: Card){
        return this._name  === card._name 
            && this._type  === card._type
            && this._value === card._value
    }

    isTheSameName(card: Card){
        return this._type === card._type
            && this._name === card._name
    }

    get name(){
        return this._name;
    }

    get value(){
        return this._value;
    }

    get type(){
        return this._type;
    }
}

export class ZodiacCard extends Card{
    constructor(name: string, value: number){
        super(name, value);
        this._type = CARD_TYPE.ZODIAC;
    }
}

export class PlanetCard extends Card{
    private protectionZodiac : Array<string> = [];
    constructor(name: string, value: number, listZodiac: Array<string>){
        super(name, value);
        this._type = CARD_TYPE.PLANET;
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

    findCard(card: Card){
        let index = -1;
        for(let i = 0; i < this.listCard.length; i++){
            const _card = this.listCard[i];
            if(_card.equalTo(card)){
                index = i;
                break;
            }
        }

        return index;
    }

    findCardsWithName(name: string){
        let list : Array<Card> = [];

        for(let i = 0; i < this.listCard.length; i++){
            const _card = this.listCard[i];
            if(_card.name === name){
                list.push(_card);
            }
        }        

        return list;
    }

    getCardToTop(card: Card){
        let index = this.findCard(card);
        if(index === -1){
            return false;
        }

        let temp : Card = this.listCard[index];
        this.listCard[index] = this.listCard[this.length-1];
        this.listCard[this.length-1] = temp;

        return true;
    }

    getCardToPos(card: Card, pos: number){
        let index = this.findCard(card);
        if(index === -1){
            return false;
        }
        if(pos >= this.length){
            return false;
        }

        let temp : Card = this.listCard[index];
        this.listCard[index] = this.listCard[pos];
        this.listCard[pos] = temp;

        return true;
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