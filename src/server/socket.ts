import * as socketio from 'socket.io';
import { FastifyInstance } from 'fastify';

export class Socket {
    socket: any;
    constructor(private app : FastifyInstance){
        this.socket = require('socket.io')(this.app.server);
        this.initEvent();
    }

    initEvent(){
        this.socket.on('connection', (socket: any) => {
            console.log("user connection...", socket.handshake);
            this.socket.sockets.emit('welcome', 'hello world');
        })
    }
}