export enum GAME_STATE{
    PLAYER_DRAWING = 0, // 0: Player trigger draw
    PLAYER_ENDTURN,     // 1: Player trigger end turn
    PLAYER_TRIGGER,     // 2: Player use card effect
    SYS_ENDTURN,        // 3: Turn is ended by system call
    SYS_TRIGGER,        // 4: Card effect is triggered by system call
    STAND_BY,           // 5: Wait for player action 
    SYS_ENDGAME,        // 6: End Game
    SYS_STARTGAME,      // 7: Start 
    SYS_WAIT,           // 8: wait for game
    SYS_WAIT_CHAIN,     // 9: wait for chain link
    SYS_ACTIVE,         // 10: start to active effect
}

export class GameAction {
    action : (...params: any) => void;
    constructor(action: (...params: any) => void){
        this.action = action;
    }

    trigger(params?: any){
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

    action(state: GAME_STATE, params? : any){
        const action = this.stateMap.get(state);
        if(!action) return;

        action.trigger(params);
    }
}