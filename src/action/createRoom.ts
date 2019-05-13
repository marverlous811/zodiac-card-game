import { ActionBase } from "../base/api-action-base";
import { IRoom } from "../model/room";
import { makeid } from "../util";

class createRoomParams{
    constructor(
        id?: string,
    ){}
}

class createRoomResponse{
    constructor(
        public id: string,
        public createDate: number,
        public status: boolean,
        public msg?: string,
    ){}
}

export class CreateRoomAction extends ActionBase{
    async process(){
        let params = this.params.body as createRoomParams;
        let meeting = createMeeting(params);
        let msg = '';
        const oldRoom = await this.store.getRoom(meeting.id)
        if(oldRoom){
            msg = 'room is already exits, open it again';
            meeting = oldRoom;
        }
        else{
            await this.store.setRoom(meeting);
            msg = 'create room success';
        }

        let response = new createRoomResponse(
            meeting.id,
            meeting.createDate,
            true,
            msg,
        )

        return response;
    }
}

export function createMeeting(params: any){
    let meeting : IRoom = {
        users: [],
        createDate: new Date().getTime(),
        id: params.id ? params.id : makeid(6),
        running: true,
    }

    return meeting;
}