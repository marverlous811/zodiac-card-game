import { Game } from "../src/controller/game";
import Player from "../src/controller/player";
import { GAME_STATE } from "../src/controller/gameAction";
import * as chai from 'chai';
import * as mocha from 'mocha';
import { FIELD_STATE } from "../src/controller/field";




export function simpleGame(){
    mocha.describe("test simple game draw to end", function(){
        mocha.it("simple game without trigger ", function(){
            const game = new Game();
            const player_1 = new Player("marverlous");
            const player_2 = new Player("raikusen");
            const player_3 = new Player("crytal_sunday");
            const player_4 = new Player("shortkiller");

            const listPlayer : Array<Player> = [player_1, player_2, player_3, player_4];

            game.on("start_game", function(){
                // console.log("start game...");
            })

            game.on("end_draw_phase", function(){
                // console.log("draw phase end");
            })
            game.on("next_turn", function(){
                // console.log("change turn ", game.nowPlayer.name);
            })
            game.on("end_game", function(){
                // console.log("end game...");
            })

            game.init(listPlayer);
            game.startGame();

            game.field.setState(FIELD_STATE.NO_TRIGGER);

            let gameState = game.gameListener.state;
            while(gameState !== GAME_STATE.SYS_ENDGAME){
                // console.log("now player: ", game.nowPlayer.name);
                game.nowPlayer.draw();

                gameState = game.gameListener.state;
            }

            const winner = game.winner;
            // console.log(winner)
            chai.expect(winner).is.not.equal(undefined);
            if(winner){
                chai.expect(winner.score).is.not.equal(0);
                chai.expect(winner.handLength).is.not.equal(0);
                const players = game.listPlayer
                for(let i = 0; i < players.length; i++){
                    const player = players[i];
                    if(player.name !== winner.name){
                        chai.expect(player.score).is.equal(0);
                        chai.expect(player.handLength).is.equal(0);
                    }
                }
            }
        })
    })
}

