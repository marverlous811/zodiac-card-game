import to from 'await-to-js';
import { FastifyInstance } from 'fastify';

export class GlobalAPIRoute{
    constructor(private fastify: FastifyInstance, private resType?: string){}

    async addRoute(path: string, handle: any){
        this.addRoutePost(path, handle);
        this.addRouteGet(path, handle);
    }

    async addRoutePost(path: string, handle: any){
        this.fastify.post(path, async (request: any, reply: any) => {
            let msg = request.query;
            msg.body = request.body;
            let [err, res] = await to(handle(msg));
            if(err){
                return this.sendResponse({status: false, error: err.message}, reply);
            }

            return this.sendResponse({status: true, res }, reply);
        })
    }

    async addRouteGet(path: string, handle: any){
        this.fastify.get(path, async (request: any, reply: any) => {
            let [err, res] = await to(handle(request.query));
            if(err){
                return this.sendResponse({status: false, error: err.message}, reply);
            }

            return this.sendResponse({status: true, res }, reply);
        })
    }

    sendResponse(data: any, reply: any){
        reply.header('content-type','application/json');
        reply.send(data);
    }
}