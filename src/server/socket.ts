import * as socketio from 'socket.io';
import { FastifyInstance } from 'fastify';
import { StorageBase } from '../base/storage-base';

interface IClientUser{
    socket: any;
    name: string;
}

export class Socket {
    socket: any;
    roomMap : Map<string, Room> = new Map();
    constructor(private app : FastifyInstance, private store: StorageBase){
        this.socket = require('socket.io')(this.app.server);
        this.initEvent();
    }

    initEvent(){
        this.socket.on('connection', this.onConnection)
    }

    onConnection = (socket: any) => {
        const { query } = socket.handshake;
        if(!query.name || !query.room){
            console.log("connection without params will exit...");
            socket.disconnect(true);
            return;
        }

        const {name, room} = query;
        
        const roomChannel = this.getRoom(room);
        const state = roomChannel.join(socket, name);
        if(state === false){
            socket.disconnect(true);
            return;
        }
    }

    getRoom(name: string){
        let room = this.roomMap.get(name);
        if(!room){
            room = new Room(this.socket, name);
            this.roomMap.set(name, room);
        }

        return room;
    }
}

export class Room{
    private listUser : Array<SocketClient> = [];
    maxUser : number = 4;
    constructor(private socket: any, private _name: string){
        
    }

    setMaxUser(number: number){
        this.maxUser = number;
    }

    join(socket: any, name: string){
        if(this.listUser.length >= this.maxUser){
            console.log("room is max");
            return false;
        }

        console.log(`connect to room ${this.name}, with name ${name}`);
        const client = new SocketClient(socket, name, this);

        this.listUser.push(client);
        return true;
    }

    sendMessage(msg : string){
        this.socket.to(this.name).emit("system", msg);
    }

    emit(event: string, data: string){
        this.socket.to(this.name).emit(event, data);
    }

    onClientDisconnect(name: string){
        console.log(`${name} has disconnected...`);
        let index = this.findClient(name);
        if(index === -1){
            return false;
        }

        this.listUser.splice(index, 1);
        console.log(this.listUser.length);
    }

    findClient(name: string){
        let index = -1;
        for(let i = 0; i < this.listUser.length; i++){
            if(this.listUser[i].name === name){
                index = i;
                break;
            }
        }

        return index;
    }

    get name(){
        return this._name;
    }
}

export class SocketClient{
    constructor(private socket: any, private _name: string, private listener: Room){
        this.socket.join(this.listener.name, () => {
            this.listener.sendMessage('hello');
        });
        this.socket.on('disconnect', () => {
            this.listener.onClientDisconnect(this.name)
        });

    }

    get name(){
        return this._name;
    }
}