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

function hasDuplicates(array : Array<any>) {
    return (new Set(array)).size !== array.length;
}

function isArraySameSorter (array1: Array<Card>, array2: Array<Card>){
    if(array1.length !== array2.length)
        return false;
    
    let isSame = true;
    for(let i = 0; i < array1.length; i++){
        const card1 = array1[i];
        const card2 = array2[i];
        if(!card1.equalTo(card2)){
            isSame = false;
            break;
        }
    }

    return isSame;
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
    mocha.describe("testing deck of card", () => {
        mocha.before("generate deck of card", function () {
            generateDeckOfCard();
            let deckLength = pokerDeck.length;
            let checkDuplicate = hasDuplicates(pokerDeck.list);
    
            chai.expect(deckLength).is.a("number");
            chai.expect(checkDuplicate).is.equal(false);
            chai.expect(deckLength).to.equal(52);
        })

        mocha.it("shuffle the deck", function(){
            const _listBefore = [...pokerDeck.list];
            shuffleDeck(5);
            let isSamePos = isArraySameSorter(_listBefore, pokerDeck.list);
            let deckLength = pokerDeck.length;
    
            chai.expect(deckLength).to.equal(52);
            chai.expect(isSamePos).to.equal(false);
        })

        mocha.after("check random card by draw 5 card", function(){
            showMyPokerHand();
            console.log(myHand.list);

            let deckLength = pokerDeck.length;
            let handLength = myHand.length;

            chai.expect(deckLength).to.equal(52 - 5);
            chai.expect(handLength).to.equal(5);
        })
    })
}