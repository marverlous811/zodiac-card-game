import Player from "./src/controller/player";
import { Game } from "./src/controller/game";

const player = new Player("marverlous");
const game = new Game();
console.log("hello ", player.getName());

console.log("deck length: ", game.listAllCard.length);
console.log(game.listAllCard);