import * as chai from 'chai';
import * as mocha from 'mocha';
import Player from '../src/controller/player';
import { dataTest } from './data.test';
import { Card } from '../src/controller/card';

const data = dataTest;

export function playerTest(){
    mocha.describe("add card to hand", function() {        
        mocha.it("add 1 card ", function(){
            const player = new Player("marverlous", null);
            const card = new Card(data[10].name, data[10].value);
            player.addCard(card);

            chai.expect(player.score).to.equal(8);
        });

        mocha.it("add 2 card with the same name", function(){
            const player = new Player("marverlous", null);

            const card1 = new Card(data[1].name, data[1].value);
            const card2 = new Card(data[10].name, data[10].value);

            player.addCard(card1);
            player.addCard(card2);

            chai.expect(player.score).to.equal(8);
            chai.expect(player.handLength).to.equal(2);
        })
    })

    mocha.describe("add list a card", function(){
        const listCard : Array<Card> = [];
        mocha.before("create list card ", function(){
            for(let i = 0; i < data.length; i++){
                const card = new Card(data[i].name, data[i].value);
                listCard.push(card);
            }
        })

        mocha.it("add list card ", function(){
            const player = new Player("marverlous", null);
            player.addCards(listCard);

            chai.expect(player.handLength).to.equal(11);
            chai.expect(player.score).to.equal(33);
        })
    })
}