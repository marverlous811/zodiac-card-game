import { Game } from "../src/controller/game";
import Player from "../src/controller/player";
import { Card, ZodiacCard, PlanetCard } from "../src/controller/card";
import * as chai from 'chai';
import * as mocha from 'mocha';
import { GAME_STATE } from "../src/controller/gameAction";
 

function createGame(){
    const game = new Game();
    const player = new Player("marverlous");
    const player2 = new Player("raikusen");
    const player3 = new Player("shortkiller");
    const player4 = new Player("crystal_sun");

    game.init([player, player2, player3, player4]);
    game.startGame();
    game.timeout(1);

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

    mocha.describe("test taurus effect", function(){
        mocha.it("normal effect", function(done){
            const game = createGame();
            const player = game.nowPlayer;
            game.deck.getCardToTop(new ZodiacCard('taurus',6));
            player.draw();

            game.on("active_done", (state) => {
                chai.expect(state).to.equal(GAME_STATE.WAIT_PLAYER_CHOICE);

                const listCard = game.cardTmp;
                player.selectACard(listCard, 0);

                chai.expect(game.state).to.equal(GAME_STATE.STAND_BY);
                chai.expect(player.handLength).to.equal(1);
                done();
            })
        })

        mocha.it("many card effect", function(done){
            const game = createGame();
            const player = game.nowPlayer;

            game.deck.getCardToTop(new PlanetCard("mars", 1, []));
            game.deck.getCardToPos(new PlanetCard("pluto", 1, []),  game.deck.length-2);
            game.deck.getCardToPos(new ZodiacCard('taurus',6),game.deck.length-3);
            player.draw();
            player.draw();
            player.draw();

            game.on("active_done", (state) => {
                chai.expect(state).to.equal(GAME_STATE.WAIT_PLAYER_CHOICE);

                const listCard = game.cardTmp;
                player.selectACard(listCard, 0);
                game.sendCardToDust(listCard);
                game.flushTmp();

                chai.expect(game.state).to.equal(GAME_STATE.STAND_BY);
                chai.expect(player.handLength).to.equal(1);
                chai.expect(game.dustLength).to.equal(19);
                chai.expect(game.cardTmp.length).to.equal(0);

                done();
            })
        })
    })

    mocha.describe("test gemini effect", function(){
        mocha.it("normal effect", function(done){
            const game = createGame();
            const player = game.nowPlayer;
            game.deck.getCardToTop(new ZodiacCard('gemini',4));
            player.draw();

            game.on("active_done", (state) => {
                const listPlayer = game.listPlayer;
                chai.expect(state).to.equal(GAME_STATE.STAND_BY);
                for(let i = 0; i < listPlayer.length; i++){
                    const _player = listPlayer[i];
                    chai.expect(_player.handLength).to.equal(1);
                }

                done();
            })
        })

        mocha.it("in the last draw", function(done){
            const game = createGame();
            const player = game.nowPlayer;

            game.deck.getCardToPos(new ZodiacCard('gemini',4),3);
            const deck = game.deck;
            
            while(deck.length > 4){
                game.deck.popCard();
            }

            player.draw();
            game.on('active_done', (state) => {
                const listPlayer = game.listPlayer;
                chai.expect(state).to.equal(GAME_STATE.SYS_ENDGAME);
                for(let i = 0; i < listPlayer.length; i++){
                    const _player = listPlayer[i];
                    if(i === listPlayer.length - 1){
                        chai.expect(_player.handLength).to.equal(0);
                    }
                    else{
                        if(_player.name === player.name){
                            chai.expect(_player.handLength).to.equal(2);
                        }
                        else{
                            chai.expect(_player.handLength).to.equal(1);
                        }
                    }
                }
                done();
            })
        })
    })
}