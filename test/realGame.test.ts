import { Game } from "../src/controller/game";
import Player from "../src/controller/player";
import { GAME_STATE } from "../src/controller/gameAction";

const game = new Game();
const player_1 = new Player("marverlous");
const player_2 = new Player("raikusen");
const player_3 = new Player("crytal_sunday");
const player_4 = new Player("shortkiller");

const listPlayer : Array<Player> = [player_1, player_2, player_3, player_4];

game.init(listPlayer);
game.startGame();

let players = game.listPlayer;

let gameState = game.gameListener.state;
while(gameState !== GAME_STATE.SYS_ENDGAME){
    console.log("now player: ", game.nowPlayer.name);
    game.nowPlayer.draw();

    gameState = game.gameListener.state;
}

console.log(game.winner);

