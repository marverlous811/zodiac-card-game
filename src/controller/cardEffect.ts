import { ICardAction } from "./game";
import { GAME_STATE } from "./gameAction";
import { Card } from "./card";
import { AriesEffect } from "../card/aries";
import { CardEffect } from "../card/effect";
import { Taurus } from "../card/taurus";
import { GeminiEffect } from "../card/gemini";
import { CancerEffect } from "../card/cancer";


export class EffectMethod{
    public static instance : EffectMethod;
    private constructor(){}
    private triggerQueue : Array<Card> = [];
    private effectMap : Map<string, CardEffect> = new Map();

    public static getInstance () {
        if(!this.instance){
            this.instance = new EffectMethod();
        }

        return this.instance;
    }

    get length() {
        return this.triggerQueue.length;
    }

    init(action : ICardAction){
        this.effectMap.set("aries", new AriesEffect(action));
        this.effectMap.set("taurus", new Taurus(action));
        this.effectMap.set("gemini", new GeminiEffect(action));
        this.effectMap.set("cancer", new CancerEffect(action));
    }

    trigger(card: Card){
        const name = card.name;
        let game_state : GAME_STATE | undefined
        const action = this.effectMap.get(name);
        if(!action){
            return GAME_STATE.STAND_BY;
        }

        game_state = action.action(card);

        return game_state
    }

    push(card: Card){
        this.triggerQueue.push(card);
    }

    activeEffect(){
        // console.log("start active effect...");
        let game_state = GAME_STATE.STAND_BY
        if(this.triggerQueue.length > 0){
            const card = this.triggerQueue.pop();
            // console.log("trigger card");
            if(card){
                game_state = this.trigger(card);
                return {game_state, card};
            }
        }

        return {game_state, card: null};
    }
}