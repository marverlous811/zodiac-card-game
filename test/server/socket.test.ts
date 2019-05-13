import * as socketIo from 'socket.io-client';

const base_url = process.env.SVR_HOST || 'http://localhost:8080';

const socket = socketIo(base_url, {query: "room=123&name=marverlous"}); 
socket.on('welcome', (msg: any) => {
    console.log(msg);
})