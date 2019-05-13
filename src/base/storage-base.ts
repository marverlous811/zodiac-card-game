export abstract class StorageBase {
    abstract async init() : Promise<any>;
    abstract async getRoom(roomId: string) : Promise<any>;
    abstract async setRoom(roomData: any) : Promise<any>;
}