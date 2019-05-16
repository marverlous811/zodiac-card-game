import * as socketio from 'socket.io';
import { FastifyInstance } from 'fastify';
import { StorageBase } from '../base/storage-base';
import GameMater from './gameMaster';

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
    private gameMaster : GameMater;
    private nowNumberReady : number = 0;
    constructor(private socket: any, private _name: string){
        this.gameMaster = new GameMater(this);
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
        if(this.gameMaster){
            this.gameMaster.onUserJoin(client);
        }
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

        if(this.gameMaster){
            this.gameMaster.onUserDisconnect(name);
        }

        this.listUser.splice(index, 1);
        this.nowNumberReady--;
        console.log(this.listUser.length);
    }

    onPlayerReady(){
        this.nowNumberReady++;
        if(this.nowNumberReady === this.maxUser){
            console.log("all player is ready");
            this.gameMaster.allReady();
        }
        const userData = {max: this.maxUser, ready: this.nowNumberReady};
        this.emit("PLAYER_READY", JSON.stringify(userData));
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
    isReady : boolean = false;
    constructor(private _socket: any, private _name: string, private listener: Room){
        this.socket.join(this.listener.name, () => {
            this.listener.sendMessage('hello');
        });
        this.socket.on('disconnect', () => {
            this.listener.onClientDisconnect(this.name)
        });

        this.socket.on('READY', (name: string) => {
            console.log(`${name} is ready`);
            this.isReady = true;
            this.listener.onPlayerReady();
        })

    }

    get ready(){
        return this.isReady
    }

    get name(){
        return this._name;
    }

    get socket(){
        return this._socket;
    }
}