import * as chai from 'chai';
import * as mocha from 'mocha';
import { Game } from "../src/controller/game";
import Player from '../src/controller/player';
import { GAME_STATE } from '../src/controller/gameAction';

const game = new Game();

const player_1 = new Player("marverlous");
const player_2 = new Player("raikusen");
const player_3 = new Player("crytal_sunday");
const player_4 = new Player("shortkiller");

const listPlayer : Array<Player> = [player_1, player_2, player_3, player_4];


export default function gameTest(){
    mocha.describe("Uint test for game ", function() {
        mocha.it("init game", function() {
            game.init(listPlayer);

            chai.expect(game.deckLength).to.equal(58);
            chai.expect(game.dustLength).to.equal(17);
            chai.expect(game.numberPlayer).to.equal(4);
        });

        mocha.it("start game with 2 card at start ", function(){
            game.setStartCard(2);
            game.startGame();

            chai.expect(game.nowPlayer.actived).to.equal(true);
            chai.expect(game.state).to.equal(GAME_STATE.STAND_BY);
            for(let i = 0; i < game.numberPlayer; i++){
                const player = game.listPlayer[i];
                chai.expect(player.handLength).to.equal(2);
            }
        })

        mocha.it("next turn ", function(){
            for(let i = 0; i < 7; i++){
                game.nextTurn();
            }

            chai.expect(game.nowTurnPlayer).to.equal(3);
            chai.expect(game.nowPlayer.actived).to.equal(true);
            chai.expect(game.state).to.equal(GAME_STATE.STAND_BY);

            for(let i = 0; i < game.numberPlayer; i++){
                if(i != game.nowTurnPlayer){
                    const player = game.listPlayer[i];
                    chai.expect(player.actived).to.equal(false);
                }
            }
        })
    })
}