import { Card, CardFactory, CARD_TYPE, PiecesCard } from "./card";
import CardData from '../store/listCard';
import Player from "./player";
import { StateMachine } from "./gameAction";

export class Game{
    deck : PiecesCard = new PiecesCard();
    dust : PiecesCard = new PiecesCard();
    cardFactory : CardFactory = CardFactory.getInstance();
    gameStateMachine: StateMachine = StateMachine.getInstance();
    listPlayer : Array<Player> = [];
    
    constructor(){
        this.init();
    }

    init(){
        this.generateCard();
    }

    createPlayer(){
        
    }

    generateCard(){
        const zodiacCard = CardData.zodiacCard;
        const planetCard = CardData.planetCard;

        for(let i = 0; i < zodiacCard.length; i++){
            const cardInfo : any = zodiacCard[i];
            for(let j = 0; j < cardInfo.values.length; j++){
                const value = cardInfo.values[j];
                const card =  this.cardFactory.makeCard(
                    CARD_TYPE.ZODIAC, 
                    cardInfo.name, 
                    value);
                if(!card) continue;

                if(value === cardInfo.minValue){
                    this.dust.addCard(card);
                }
                else{
                    this.deck.addCard(card);
                }
            }
        }

        for(let i = 0; i < planetCard.length; i++){
            const cardInfo : any = planetCard[i];
            const card = this.cardFactory.makeCard(
                CARD_TYPE.PLANET, 
                cardInfo.name, 
                cardInfo.values, 
                cardInfo.listZodiac);

            if(!card) continue;

            this.deck.addCard(card);
        }
    }
}