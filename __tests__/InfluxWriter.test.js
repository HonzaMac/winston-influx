const {InfluxWriter: InfluxWriterTest} = require('../src');

describe('influxWriter', () => {

    it('writes requests to influx', async () => {
        expect.assertions(4);
        let writer = new InfluxWriterTest({
            batchSize: 1,
            tags: {
                service: 'test'
            }
        });
        writer._influx = {
            writePoints(batch) {
                expect(batch).toHaveLength(1);
                batch.forEach(point => {
                    expect(point.timestamp).not.toBeNull();

                    let expectWithHostname = {
                        service: 'test',
                        a: 'b',
                        hostname: point.tags.hostname,
                    };

                    expect(point.tags).toStrictEqual(expectWithHostname);
                    expect(point.fields).toStrictEqual({time: 5});
                });
                return Promise.resolve();
            }
        };

        await writer.writePoint('test', {a: 'b'}, {time: 5});
    });

    it('write 1001 requests to influx - we should properly rotate counter', () => {
            expect.assertions(1);
            const writer = new InfluxWriterTest();
            writer._counter = 1000;
            writer.writePoint('test', {a: 'b'}, {time: 5});
            expect(writer._counter).toBe(1);
        }
    );
});
