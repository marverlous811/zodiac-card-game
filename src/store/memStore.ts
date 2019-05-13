import { StorageBase } from "../base/storage-base";

export class MemStore extends StorageBase{
    roomMap : Map<string, any > = new Map();
    public static instance: MemStore;
    private constructor(){
        super();
    }

    public static getInstance(){
        if(!this.instance){
            this.instance = new MemStore();
        }

        return this.instance;
    }

    init(){
        return new Promise((resolve : any) => {
            resolve(true);
        })
    }
    
    async getRoom(roomId: string){
        return await this.roomMap.get(roomId);
    }

    async setRoom(roomData: any){
        const roomId = roomData.id;
        return await this.roomMap.set(roomId, roomData)
    }
}