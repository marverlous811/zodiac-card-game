import * as fastify from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import to from 'await-to-js';
import '../../config';
import { StorageBase } from '../base/storage-base';
import { MemStore } from '../store/memStore';
import { route } from './route';
import { Socket } from './socket';

const server : fastify.FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({});
const port : number = parseInt(process.env.PORT || '8080');
const storeType : string = process.env.STORE_TYPE || 'mem';

function getDataStore(type: string){
    let store : StorageBase | undefined;
    switch(type){
        case 'mem': 
            store = MemStore.getInstance();
            break;
        default:
            break;
    }

    return store;
}

export const boot = async () => {

    //init data store
    const store = getDataStore(storeType);
    if(!store){
        console.log("this app is not define this type of data store");
        return;
    }
    let [_err, res] = await to(store.init());
    if(_err){
        console.log("error when init data store: ", _err);
    }

    //init route
    route(server, store);

    //init socket io
    const socketIO = new Socket(server, store);

    //init server listener
    let [err, data] = await to(server.listen(port, '0.0.0.0'));
    if(err){
        console.log("error to start server ", err);
    }
    else{
        let date = new Date();
        console.log("Server is listen on " + port + " at", date);
    }
}