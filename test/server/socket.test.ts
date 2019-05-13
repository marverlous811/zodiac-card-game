import * as socketIo from 'socket.io-client';

const base_url = process.env.SVR_HOST || 'http://localhost:8080';

const socket = socketIo(base_url, {query: "room=123&name=marverlous"}); 
socket.on('system', (msg: any) => {
    console.log(`system to marverlous: ${msg}`);
})

const socket1 = socketIo(base_url, {query: "room=123&name=raikusen"}); 
socket1.on('system', (msg: any) => {
    console.log(`system to raikusen: ${msg}`);
})

const socket2 = socketIo(base_url, {query: "room=123&name=crystal_sunday"}); 
socket2.on('system', (msg: any) => {
    console.log(`system to crystal_sunday: ${msg}`);
})

const socket3 = socketIo(base_url, {query: "room=123&name=shortkiller"}); 
socket3.on('system', (msg: any) => {
    console.log(`system to shortkiller: ${msg}`);
})

const socket4 = socketIo(base_url, {query: "room=123&name=tom"}); 
socket4.on('system', (msg: any) => {
    console.log(`system to tom: ${msg}`);
})

const socket5 = socketIo(base_url, {query: "room=1234&name=hello"}); 
socket5.on('system', (msg: any) => {
    console.log(`system to tom: ${msg}`);
})