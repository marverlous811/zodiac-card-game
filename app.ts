import { Game } from "./src/controller/game";

const game = new Game();

console.log("deck length: ", game.deck.length);
console.log("dust length: ", game.dust.length);
console.log(game.dust);
console.log(game.deck);