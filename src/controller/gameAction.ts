export enum GAME_STATE{
    PLAYER_DRAWING, // Player trigger draw
    PLAYER_ENDTURN, // Player trigger end turn
    PLAYER_TRIGGER, // Player use card effect
    SYS_ENDTURN,    // Turn is ended by system call
    SYS_TRIGGER,    // Card effect is triggered by system call
    STAND_BY,       // Wait for player action 
}

export class GameAction {
    action : () => void;
    constructor(action: () => void){
        this.action = action;
    }

    trigger(){
        this.action();
    }
}

export class StateMachine{
    public static instance : StateMachine;
    private stateMap : Map<GAME_STATE, GameAction>;
    private constructor(){
        this.stateMap = new Map();
    }

    public static getInstance(){
        if(!this.instance){
            this.instance = new StateMachine();
        }

        return this.instance;
    }


    setActionForState(state : GAME_STATE, gameAction : GameAction){
        this.stateMap.set(state, gameAction);
    }

    action(state: GAME_STATE){
        const action = this.stateMap.get(state);
        if(!action) return;

        action.trigger();
    }
}