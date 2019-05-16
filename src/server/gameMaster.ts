import { Game } from "../controller/game";
import { Room, SocketClient } from "./socket";
import Player from "../controller/player";
import gameTest from "../../test/game.test";

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
        this.initEventListener();
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
        console.log("game start...");
        const data = {nowTurn: this.game.nowPlayer.name}
        this.room.emit("START_GAME", JSON.stringify(data));
    }

    onEndDrawPhase = () => {}
    onNextTurn = () => {}
    onTriggerCard = () => {}
    onActivePhase = () => {}
    onEndGame = () => {}
    onActiveChain = () => {}
    onActiveDone = () => {}

    allReady = async () => {
        const listPlayer : Array<Player> = [];
        await this.listUser.forEach(async (value, key) => {
            await listPlayer.push(value.player);
        })

        console.log(listPlayer);
        this.game.init(listPlayer);
        this.game.startGame();
    }


}