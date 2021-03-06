import { Card, CardFactory, CARD_TYPE, PiecesCard } from "./card";
import CardData from '../store/listCard';
import Player from "./player";
import { StateMachine, GAME_STATE, GameAction } from "./gameAction";
import { Field, FIELD_STATE } from "./field";
import { shuffleArray } from "../util";
import { GameListener } from "./gameListener";
import events = require('events');
import { EffectMethod } from "./cardEffect";

export interface ICardAction{
    cardTmp: Array<Card>;
    deck: PiecesCard;
    dust: PiecesCard;
    field: Field;
    userTimeout : number;
    changeFieldState: (state: FIELD_STATE) => void;
    giveBackDeck: (listCard: Array<Card>) => void;
    addCardToTmp: (piecesCard: PiecesCard) => void;
    giveACard: () => void;
    giveForAll: () => boolean;
    dropCardFromTmp: (piecesCard: PiecesCard) => void;
    changeGameState: (state: GAME_STATE) => void;
    sendCardToDust: (listCard: Array<Card>) => void;
    addCardForNowPlayer: (listCard: Array<Card>) => void;
    flushTmp: () => void;
}

export class Game extends events.EventEmitter implements ICardAction{
    private cardFactory : CardFactory = CardFactory.getInstance();
    private gameStateMachine: StateMachine = StateMachine.getInstance();
    private gameListener: GameListener = new GameListener(this.gameStateMachine);
    private numberShuffle: number = 10;
    private triggerTimeout: number = 10;
    private timeoutId : any = -1;
    private startCard: number = 0;

    userTimeout : number = 20;
    cardTmp : Array<Card> = [];
    deck : PiecesCard = new PiecesCard();
    dust : PiecesCard = new PiecesCard();
    listPlayer : Array<Player> = [];
    field: Field = new Field();
    nowTurnPlayer: number = 0;
    winner: Player | undefined;
    effectMethod: EffectMethod = EffectMethod.getInstance(); 
    
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

    get state(){
        return this.gameListener.state
    }

    timeout(second: number){
        this.triggerTimeout = second;
    }

    setStartCard(number: number){
        this.startCard = number;
    }

    init(players: Array<Player>){
        this.generateCard();
        this.createPlayer(players);
        this.setAction();
        this.effectMethod.init(this);
        this.changeGameState(GAME_STATE.SYS_STARTGAME);
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
        const systemEnd = () => { 
            this.endTurn(true) 
        };

        this.gameStateMachine.setActionForState(GAME_STATE.PLAYER_DRAWING, new GameAction(this.getFromDeckToField));
        this.gameStateMachine.setActionForState(GAME_STATE.PLAYER_ENDTURN, new GameAction(playerEnd));
        this.gameStateMachine.setActionForState(GAME_STATE.SYS_ENDTURN, new GameAction(systemEnd));
        this.gameStateMachine.setActionForState(GAME_STATE.SYS_ENDGAME, new GameAction(this.endGame));
        this.gameStateMachine.setActionForState(GAME_STATE.SYS_TRIGGER, new GameAction(this.triggerCard));
        this.gameStateMachine.setActionForState(GAME_STATE.SYS_ACTIVE, new GameAction(this.activeEffect));
    }

    startGame = () => {
        for(let i = 0; i < this.numberShuffle; i++){
            this.listPlayer = shuffleArray(this.listPlayer);
            this.shuffleCard(this.deck);
            this.shuffleCard(this.dust);
        }
        if(this.startCard !== 0){
            for(let i = 0; i < this.startCard; i++){
                this.giveForAll();
            }
        }
        this.nowPlayer.setActive(true);
        this.changeGameState(GAME_STATE.STAND_BY);
        this.emit("start_game");
    }

    getFromDeckToField = () => {
        const card = this.deck.popCard();
        if(!card) return;

        const state = this.field.push(card);
        this.emit("end_draw_phase", card);
        if(this.deck.length === 0){
            this.changeGameState(GAME_STATE.SYS_ENDGAME);
            return;
        }

        if(state){
            if(state === GAME_STATE.SYS_TRIGGER){
                this.changeGameState(state, card);
            }
            else{
                this.changeGameState(state);
            }
        }     
    }

    endTurn = (dropFlag: boolean) => {
        const listCardFromField = this.field.spliceAllCard(); 

        if(dropFlag){
            this.sendCardToDust(listCardFromField);
        }
        else{
            this.nowPlayer.addCards(listCardFromField);
        }

        const nowPlayer = this.nowPlayer;
        
        if(this.gameListener.state !== GAME_STATE.SYS_ENDGAME){
            this.nextTurn();
            const nextPlayer = this.nowPlayer;
            this.emit("next_turn", nowPlayer, nextPlayer);
        }
    }

    triggerCard = (card: Card) => {
        // console.log(card);
        this.effectMethod.push(card);
        this.changeGameState(GAME_STATE.SYS_WAIT_CHAIN);
        this.emit("trigger_card", card);
        if(this.timeoutId > 0){
            clearTimeout(this.timeoutId);
        }

        this.timeoutId = setTimeout(() => {
            // console.log("no player wait to change...");
            this.changeGameState(GAME_STATE.SYS_ACTIVE);
            this.emit("active_phase")
        }, this.triggerTimeout * 1000);
    }

    nextTurn = () => {
        this.nowPlayer.setActive(false);
        if(this.nowTurnPlayer + 1 >= this.numberPlayer){
            this.nowTurnPlayer = 0;
            this.nowPlayer.setActive(true);
            this.changeGameState(GAME_STATE.STAND_BY);
            return;
        }

        this.nowTurnPlayer++;
        this.nowPlayer.setActive(true);
        this.changeGameState(GAME_STATE.STAND_BY);
    }

    endGame = () => {
        this.endTurn(false);
        this.winner =  this.whoIsWinner();
        this.emit("end_game", this.winner, this.nowPlayer);
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

    activeEffect = () => {
        const {game_state, card} = this.effectMethod.activeEffect();
        if( game_state !== GAME_STATE.SYS_ENDTURN
            && game_state !== GAME_STATE.SYS_ENDGAME 
            && this.effectMethod.length > 0){
            this.emit("active_chain", game_state, card);
            return this.effectMethod.activeEffect();
        }
        else{
            this.changeGameState(game_state);
            this.emit("active_done", game_state, card);
        }
    }


    /**
     * Implement Card Action Interface
     */
    changeFieldState = (state: FIELD_STATE) => {
        this.field.setState(state);
    }

    giveBackDeck = (listCard: Array<Card>) => {
        for(let i = listCard.length - 1; i >= 0 ; i--){
            const card = listCard[i];
            this.dust.addCard(card);
        }

        this.flushTmp();
        this.changeGameState(GAME_STATE.STAND_BY);``
    }

    addCardToTmp = () => {

    }

    giveACard = () => {

    }

    giveForAll = () => {
        let state = true;
        let cardOrder = [];
        const nowIndex = this.nowTurnPlayer;
        
        for(let i = 0; i < this.players.length; i++){
            if(nowIndex + i >= this.players.length){
                cardOrder.push(0);
            }
            cardOrder.push(nowIndex+i);
        }

        for(let i = 0; i < this.players.length; i++){
            if(this.deck.length === 0){
                state = false;
                break;
            }

            const card = this.deck.popCard();
            if(!card){
                continue
            }
            this.players[cardOrder[i]].addCard(card);
        }

        return state;
    }

    addCardForNowPlayer = (listCard: Array<Card>) => {
        this.nowPlayer.addCards(listCard);
    }

    dropCardFromTmp = () => {
        
    }

    changeGameState = (state: GAME_STATE, params?: any) =>{
        this.gameListener.changeState(state, params);
    }

    sendCardToDust = (listCard: Array<Card>) => {
        for(let i = 0; i < listCard.length; i++){
            const card = listCard[i];
            this.dust.addCard(card);
        }
    }

    flushTmp(){
        this.cardTmp = [];
    }
}