import { PiecesCard, Card } from "../src/controller/card";
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as mocha from 'mocha';

const value = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12];
const kind = ["shape", "heart", "club", "diamond"];

const pokerDeck = new PiecesCard();
const myHand = new PiecesCard();

function generateDeckOfCard(){
    for(let i = 0; i < kind.length; i++){
        for(let j = 0; j < value.length; j++){
            const card = new Card(kind[i], value[j]);
            pokerDeck.addCard(card);
        }
    }
}

/**
 * @param number: number time to shuffle 
 */
function shuffleDeck(number: number){
    for(let i = 0; i < number; i++){
        pokerDeck.shuffle();
    }
}

function showMyPokerHand(){
    for (let i = 0; i < 5; i++){
        const card = pokerDeck.popCard();
        if(!card) break;

        myHand.addCard(card);
    }
}

export function testDeckOfCard(){
    mocha.it("generate deck of card", function () {
        generateDeckOfCard();
        let deckLength = pokerDeck.length;

        chai.expect(deckLength).is.a("number");
        chai.expect(deckLength).to.equal(52);
    })
    
    shuffleDeck(5);

    mocha.it("check draw a random card", function(){
        showMyPokerHand();
        console.log(myHand.list);

        let deckLength = pokerDeck.length;
        let handLength = myHand.length;

        chai.expect(deckLength).to.equal(52 - 5);
        chai.expect(handLength).to.equal(5);
    })

}