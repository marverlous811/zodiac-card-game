export default class Player{
    private id: number = 0;
    private name: string;
    constructor(name: string){
        this.name = name;
    }

    getName(){
        return this.name;
    }
}