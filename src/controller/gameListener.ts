import { StateMachine, GAME_STATE } from "./gameAction";

export class GameListener{
    private gameStateMachine : StateMachine;
    private _state: GAME_STATE = GAME_STATE.SYS_WAIT;
    constructor(stateMachine: StateMachine){
        this.gameStateMachine = stateMachine;
    }

    get state(){
        return this._state;
    }

    changeState(state: GAME_STATE){
        this._state = state;
        this.gameStateMachine.action(this._state);
    }
}