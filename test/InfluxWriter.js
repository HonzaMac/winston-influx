const {InfluxWriter} = require('../src');
const {describe, it} = require('mocha');
const {expect} = require('chai');

describe('InfluxWriter', function () {

    it('writes requests to influx', function () {
        let writer = new InfluxWriter({
            batchSize: 1,
            tags: {
                service: 'test'
            }
        });
        writer._influx = {
            writePoints(batch) {
                expect(batch.length).to.equal(1);
                batch.forEach(point => {
                    expect(point.timestamp).to.not.be.null;

                    let expectWithHostname = {
                        service: 'test',
                        a: 'b',
                        hostname: point.tags.hostname,
                    };

                    expect(point.tags).to.deep.equal(expectWithHostname);
                    expect(point.fields).to.deep.equal({time: 5});
                });
                return Promise.resolve();
            }
        };

        writer.writePoint('test', {a: 'b'}, {time: 5});
    });
});
