import { StorageBase } from "./storage-base";

export abstract class ActionBase{
    constructor(protected params: any, protected store : StorageBase){}

    abstract async process() : Promise<any>;
}