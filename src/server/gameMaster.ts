import { Game } from "../controller/game";
import { Room, SocketClient } from "./socket";
import Player from "../controller/player";

export interface IPlayerData{
    socket: any,
    player: Player
}

export default class GameMater{
    private game: Game = new Game();
    private id: string = '';
    private room : Room;
    private listUser : Map<String, IPlayerData> = new Map();

    constructor(room : Room){
        this.room = room;
    }

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

    onUserJoin = (user : SocketClient) => {
        const name = user.name;

        const player = new Player(name);
        const playerData : IPlayerData = {socket: user.socket, player};
        this.listUser.set(name, playerData);
    }

    onUserDisconnect = (name: string) => {
        this.listUser.delete(name);
    }

    onGameStart = () => {
        this.room.emit("start_game", "");
    }
    onEndDrawPhase = () => {}
    onNextTurn = () => {}
    onTriggerCard = () => {}
    onActivePhase = () => {}
    onEndGame = () => {}
    onActiveChain = () => {}
    onActiveDone = () => {}
}