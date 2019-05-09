export enum GAME_STATE{
    PLAYER_DRAWING, // Player trigger draw
    PLAYER_ENDTURN, // Player trigger end turn
    PLAYER_TRIGGER, // Player use card effect
    SYS_ENDTURN,    // Turn is ended by system call
    SYS_TRIGGER,    // Card effect is triggered by system call
    STAND_BY,       // Wait for player action 
    SYS_ENDGAME,    // End Game
    SYS_STARTGAME,  // Start 
    SYS_WAIT,       // wait for game
}

export class GameAction {
    action : (...params: any) => void;
    constructor(action: (...params: any) => void){
        this.action = action;
    }

    trigger(...params: any){
        this.action(params);
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

    action(state: GAME_STATE, ...params : any){
        const action = this.stateMap.get(state);
        if(!action) return;

        action.trigger(params);
    }
}