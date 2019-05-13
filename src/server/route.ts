import { GlobalAPIRoute } from "../base/global-api-route";
import fastify = require("fastify");
import { StorageBase } from "../base/storage-base";
import { CreateRoomAction } from "../action/createRoom";

export const route = function(server : fastify.FastifyInstance, store: StorageBase){
    const globalRoute = new GlobalAPIRoute(server);

    globalRoute.addRoutePost('/create_room', async (req: any) => {
        let createRoomAction = new CreateRoomAction(req, store);
        return await createRoomAction.process()
    })
}