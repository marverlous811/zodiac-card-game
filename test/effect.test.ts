import { Game } from "../src/controller/game";
import Player from "../src/controller/player";
import { Card, ZodiacCard } from "../src/controller/card";
import * as chai from 'chai';
import * as mocha from 'mocha';
import { GAME_STATE } from "../src/controller/gameAction";
 

function createGame(){
    const game = new Game();
    const player = new Player("marverlous");

    game.init([player]);
    game.startGame();

    return game;
}

export default function effectTest(){
    mocha.describe("test aries effect", function() {
        mocha.it("normal effect", function(done){
            const game = createGame();
            const player = game.nowPlayer;

            game.deck.getCardToPos(new ZodiacCard('taurus',8), game.deck.length-3);
            game.deck.getCardToPos(new ZodiacCard('scorpio',1),game.deck.length-2);
            game.deck.getCardToTop(new ZodiacCard('aries',6));
            player.draw();

            game.on("active_done", (state) => {
                chai.expect(state).to.equal(GAME_STATE.STAND_BY);
                chai.expect(game.field.length).to.equal(3);
                done();
            })
        })

        mocha.it("with aries in two off next card", function(done){
            const game = createGame();
            const player = game.nowPlayer;
            
            game.deck.getCardToPos(new ZodiacCard('aries',8), game.deck.length-3);
            game.deck.getCardToPos(new ZodiacCard('scorpio',1),  game.deck.length-2);
            game.deck.getCardToTop(new ZodiacCard('aries',6));
            player.draw();

            game.on("active_done", (state) => {
                chai.expect(state).to.equal(GAME_STATE.SYS_ENDTURN);
                chai.expect(game.field.length).to.equal(0);
                chai.expect(player.handLength).to.equal(2);
                chai.expect(game.dust.length).to.equal(18);
                done();
            })
        })

        mocha.it("without aries in two off next card", function(done){
            const game = createGame();
            const player = game.nowPlayer;

            game.deck.getCardToPos(new ZodiacCard('taurus',8), game.deck.length-3);
            game.deck.getCardToPos(new ZodiacCard('taurus',6),  game.deck.length-2);
            game.deck.getCardToTop(new ZodiacCard('aries',6));
            player.draw();

            game.on("active_done", (state) => {
                chai.expect(state).to.equal(GAME_STATE.SYS_ENDTURN);
                chai.expect(game.field.length).to.equal(0);
                chai.expect(player.handLength).to.equal(0);
                chai.expect(game.dust.length).to.equal(20);
                done();
            })
        })
    })
}