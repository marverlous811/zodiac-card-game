import axios from 'axios';
import to from 'await-to-js';
import * as chai from 'chai';
import * as mocha from 'mocha';

const base_url = process.env.SVR_HOST || 'http://localhost:8080';

export function apiTest(){
    describe("create room API", () => {
        it("create room ", async () => {
            let [err, res] = await to(axios({
                url: base_url+'/create_room',
                method: 'post',
                data: {
                    id: '123'
                }
            }))

            if(err || !res){
                console.log("call api error", err);
                return;
            }

            chai.expect(res.status).to.equal(200)
            chai.expect(res.data.status).to.equal(true)
            chai.expect(res.data).has.property('res')
            chai.expect(res.data.res).has.property('id')
            chai.expect(res.data.res.id).to.equal('123')
        })
    })
}