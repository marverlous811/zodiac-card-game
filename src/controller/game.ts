import { Card, CardFactory, CARD_TYPE, PiecesCard } from "./card";
import CardData from '../store/listCard';
import Player from "./player";
import { StateMachine, GAME_STATE, GameAction } from "./gameAction";
import { Field } from "./field";
import { shuffleArray } from "../util";
import { GameListener } from "./gameListener";

export class Game{
    deck : PiecesCard = new PiecesCard();
    dust : PiecesCard = new PiecesCard();
    cardFactory : CardFactory = CardFactory.getInstance();
    gameStateMachine: StateMachine = StateMachine.getInstance();
    listPlayer : Array<Player> = [];
    field: Field = new Field();
    gameListener: GameListener = new GameListener(this.gameStateMachine);
    nowTurnPlayer: number = 0;
    winner: Player | undefined;
    
    get nowPlayer(){
        return this.listPlayer[this.nowTurnPlayer];
    }

    get players(){
        return this.listPlayer;
    }

    get numberPlayer(){
        return this.listPlayer.length;
    }

    get deckLength(){
        return this.deck.length;
    }

    get dustLength(){
        return this.dust.length;
    }

    init(players: Array<Player>){
        this.generateCard();
        this.createPlayer(players);
        this.setAction();
        this.gameListener.changeState(GAME_STATE.SYS_STARTGAME);
    }

    createPlayer(players: Array<Player>){
        this.listPlayer = players;
        for(let i = 0; i < this.listPlayer.length; i++){
            this.listPlayer[i].setListener(this.gameListener);
        }
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

    shuffleCard(deck: PiecesCard){
        deck.shuffle();
    }

    setAction(){
        const playerEnd = () => { this.endTurn(false) };
        const systemEnd = () => { this.endTurn(true) };

        this.gameStateMachine.setActionForState(GAME_STATE.PLAYER_DRAWING, new GameAction(this.getFromDeckToField));
        this.gameStateMachine.setActionForState(GAME_STATE.PLAYER_ENDTURN, new GameAction(playerEnd));
        this.gameStateMachine.setActionForState(GAME_STATE.SYS_ENDTURN, new GameAction(systemEnd));
        this.gameStateMachine.setActionForState(GAME_STATE.SYS_ENDGAME, new GameAction(this.endGame));
    }

    startGame = () => {
        this.listPlayer = shuffleArray(this.listPlayer);
        this.shuffleCard(this.deck);
        this.shuffleCard(this.dust);
        this.nowPlayer.setActive(true);
        this.gameListener.changeState(GAME_STATE.STAND_BY);
    }

    getFromDeckToField = () => {
        const card = this.deck.popCard();
        if(this.deck.length === 0){
            this.gameListener.changeState(GAME_STATE.SYS_ENDGAME);
        }
        if(!card) return;

        const state = this.field.push(card);
        if(state)
            this.gameListener.changeState(state);
    }

    endTurn = (dropFlag: boolean) => {
        const listCardFromField = this.field.spliceAllCard(); 

        if(dropFlag){
            this.sendCardToDust(listCardFromField);
        }
        else{
            this.nowPlayer.addCards(listCardFromField);
        }
        
        if(this.gameListener.state !== GAME_STATE.SYS_ENDGAME)
            this.nextTurn();
    }

    sendCardToDust = (listCard: Array<Card>) => {
        for(let i = 0; i < listCard.length; i++){
            const card = listCard[i];
            this.dust.addCard(card);
        }
    }

    nextTurn = () => {
        this.nowPlayer.setActive(false);
        if(this.nowTurnPlayer + 1 >= this.numberPlayer){
            this.nowTurnPlayer = 0;
            this.nowPlayer.setActive(true);
            return;
        }

        this.nowTurnPlayer++;
        this.nowPlayer.setActive(true);
        this.gameListener.changeState(GAME_STATE.STAND_BY);
    }

    endGame = () => {
        this.endTurn(false);
        this.winner =  this.whoIsWinner();
    }

    whoIsWinner = () => {
        const listPlayer = this.listPlayer;
        let maxScore = -1;
        let winner : Player | undefined;

        for(let i = 0; i < listPlayer.length; i++){
            const player = listPlayer[i];
            if(player.score > maxScore){
                maxScore = player.score;
                winner = player;
            }
        }

        return winner;
    }
}