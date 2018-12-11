const {Batcher} = require('../src');
const {describe, it} = require('mocha');
const {expect} = require('chai');

describe('Batcher', function () {

    it('sends a batch when the max size is reached', function () {
        let batcher = new Batcher({
            batchSize: 5
        });
        let flushed = false;
        batcher.on('flush', function () {
            flushed = true;
        });

        for (let i = 0; i < 4; i++) {
            batcher.write(i);
        }
        expect(flushed).to.be.false;
        batcher.write(1);
        expect(flushed).to.be.true;
    });

    it('sends a batch when the interval has passed', function (done) {
        let batcher = new Batcher({
            interval: 1
        });

        let flushed = false;
        batcher.on('flush', function () {
            flushed = true;
        });
        batcher.write(0);
        expect(flushed).to.be.false;

        setTimeout(() => {
            expect(flushed).to.be.true;
            batcher.close();
            done();
        }, 1100);
    });
});
