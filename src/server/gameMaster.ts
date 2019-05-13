import { Game } from "../controller/game";

export default class GameMater{
    private game: Game = new Game();
    private id: string = '';
    
    constructor(){}

    initEventListener(){
        this.game.on('start_game', this.onGameStart);
        this.game.on('end_draw_phase', this.onEndDrawPhase);
        this.game.on('next_turn', this.onNextTurn);
        this.game.on('trigger_card', this.onTriggerCard);
        this.game.on('active_phase', this.onActivePhase);
        this.game.on('end_game', this.onEndGame);
        this.game.on('active_chain', this.onActiveChain);
        this.game.on('active_done', this.onActiveDone);
    }

    onGameStart = () => {}
    onEndDrawPhase = () => {}
    onNextTurn = () => {}
    onTriggerCard = () => {}
    onActivePhase = () => {}
    onEndGame = () => {}
    onActiveChain = () => {}
    onActiveDone = () => {}
}