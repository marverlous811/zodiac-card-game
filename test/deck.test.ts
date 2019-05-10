import { PiecesCard, Card } from "../src/controller/card";
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as mocha from 'mocha';

const value = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const kind = ["shape", "heart", "club", "diamond"];

let pokerDeck = new PiecesCard();
const myHand = new PiecesCard();

function generateDeckOfCard(deck: PiecesCard){
    for(let i = 0; i < kind.length; i++){
        for(let j = 0; j < value.length; j++){
            const card = new Card(kind[i], value[j]);
            deck.addCard(card);
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
    mocha.describe("test deck of card", () => {
        mocha.before("generate deck of card", function () {
            generateDeckOfCard(pokerDeck);
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

            let checkDuplicate = hasDuplicates(pokerDeck.list);
    
            chai.expect(deckLength).to.equal(52);
            chai.expect(isSamePos).to.equal(false);
            chai.expect(checkDuplicate).is.equal(false);
        })

        mocha.after("check random card by draw 5 card", function(){
            showMyPokerHand();
            // console.log(myHand.list);

            let deckLength = pokerDeck.length;
            let handLength = myHand.length;
            let checkDuplicate = hasDuplicates(myHand.list);

            chai.expect(deckLength).to.equal(52 - 5);
            chai.expect(handLength).to.equal(5);
            chai.expect(checkDuplicate).is.equal(false);
        })
    })

    mocha.describe("test search card", () => {
        mocha.it("search a card", function() {
            const deck = new PiecesCard();
            generateDeckOfCard(deck);
            
            const card = new Card("heart", 1);
            const index = deck.findCard(card);
            const _card = deck.list[index];

            chai.expect(index).is.a("number");
            chai.expect(index).to.equal(13);
            chai.expect(_card.name).to.equal("heart");
            chai.expect(_card.value).to.equal(1);
        })

        mocha.it("search a list card with the same name", function(){
            const deck = new PiecesCard();
            generateDeckOfCard(deck);

            const list = deck.findCardsWithName("heart");
            const random = Math.floor(Math.random() * (+12 - +0)) + +0; 

            chai.expect(list).is.a("array");
            chai.expect(list.length).to.equal(13);
            chai.expect(list[random].name).to.equal("heart");
        })

        mocha.it("swap a card to top", function(){
            const deck = new PiecesCard();
            generateDeckOfCard(deck);

            const card = new Card("heart", 1);
            const index = deck.findCard(card);

            const state = deck.getCardToTop(card);

            chai.expect(state).to.equal(true);
            chai.expect(deck.list[deck.length-1].equalTo(card)).to.equal(true);
            chai.expect(deck.list[index].equalTo(new Card("diamond",13))).to.equal(true);
        })

        mocha.it("swap a card to top with the false card", function(){
            const deck = new PiecesCard();
            generateDeckOfCard(deck);

            const card = new Card("scopion", 1);
            const state = deck.getCardToTop(card);

            chai.expect(state).to.equal(false);
        })
    })
}