let chai = require('chai');
let expect = require('chai').expect;
describe('Program API', () => {
    it('it should be array data', (done) => {
        chai.request('localhost:2000') // chai meminta base URL dan port kita
            .get('/api/all-program') // 'get' disini adalah REST method dan '/' adalah endpoint kita
            .end((err, res) => {
                // kita melakukan response assertion disini
                expect(res.body).to.have.status(200);
                expect(res.body).to.have.property('wakif_ids');
            });
        done();
    });
});