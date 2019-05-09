import * as chai from 'chai';
import * as mocha from 'mocha';
import { Field, FIELD_STATE } from '../src/controller/field';
import { dataTest } from './data.test';
import { Card } from '../src/controller/card';
import { GAME_STATE } from '../src/controller/gameAction';

function addCardToField(field: Field){
    const data = dataTest;
    for(let i = 0; i < data.length; i++){
        const card = new Card(data[i].name, data[i].value);
        field.push(card);
    }
}

function addCardTest(field: Field){
    const data = dataTest[0];
    const card = new Card(data.name, data.value);

    return field.push(card);
}

function addSameCardName(field: Field){
    const data = dataTest[0];
    const card = new Card(data.name, data.value);

    field.push(card);

    const _data = dataTest[7];
    const _card = new Card(_data.name, _data.value);

    return field.push(_card);
}

export function fieldTest(){
    mocha.describe("test add card to field", function() {
        mocha.describe("test with normal state", function(){
            mocha.it("add a card", function (){
                const field = new Field();
                const state = addCardTest(field);
                
                chai.expect(state).to.equal(GAME_STATE.SYS_TRIGGER);
            })

            mocha.it("add a card with name is duplicated", function(){
                const field = new Field();
                const state = addSameCardName(field);
                
                chai.expect(state).to.equal(GAME_STATE.SYS_ENDTURN);
            })
        })

        mocha.describe("test without filter", function(){
            mocha.it("add a card", function (){
                const field = new Field();
                field.setState(FIELD_STATE.NO_FILTER)
                const state = addCardTest(field);
                
                chai.expect(state).to.equal(GAME_STATE.SYS_TRIGGER);
            })

            mocha.it("add a card with name is duplicated", function(){
                const field = new Field();
                field.setState(FIELD_STATE.NO_FILTER)
                const state = addSameCardName(field);
                
                chai.expect(state).to.equal(GAME_STATE.SYS_TRIGGER);
            })
        })

        mocha.describe("test without trigger", function(){
            mocha.it("add a card", function (){
                const field = new Field();
                field.setState(FIELD_STATE.NO_TRIGGER)
                const state = addCardTest(field);
                
                chai.expect(state).to.equal(GAME_STATE.STAND_BY);
            })

            mocha.it("add a card with name is duplicated", function(){
                const field = new Field();
                field.setState(FIELD_STATE.NO_TRIGGER)
                const state = addSameCardName(field);
                
                chai.expect(state).to.equal(GAME_STATE.SYS_ENDTURN);
            })
        })

        mocha.describe("test add only", function(){
            mocha.it("add a card", function (){
                const field = new Field();
                field.setState(FIELD_STATE.ADD_ONLY)
                const state = addCardTest(field);
                
                chai.expect(state).to.equal(GAME_STATE.STAND_BY);
            })

            mocha.it("add a card with name is duplicated", function(){
                const field = new Field();
                field.setState(FIELD_STATE.ADD_ONLY)
                const state = addSameCardName(field);
                
                chai.expect(state).to.equal(GAME_STATE.STAND_BY);
            })
        })
    })

    mocha.describe("test splice all field card", function(){
        mocha.it("splice all card", function(){
            const field = new Field();
            field.setState(FIELD_STATE.ADD_ONLY)
            addCardToField(field);

            const oldLength = field.length;
            const list = field.spliceAllCard();

            chai.expect(list).be.a("Array");
            chai.expect(field.length).to.equal(0);
            chai.expect(list.length).to.equal(oldLength);
        })
    })
}
