import { InfluxDB, IPoint } from 'influx'
import InfluxWriter from '../src/InfluxWriter'



describe('influxWriter', () => {

    const defaultParameters = {
        batchSize: 1,
        tags: {
            service: 'test'
        },
        host: 'localhost'
    }
    it('writes requests to influx', async () => {
        expect.assertions(4)
        const writer = new class extends InfluxWriter{
            _influx = new class extends InfluxDB{
                writePoints(batch: IPoint[]) {
                    expect(batch).toHaveLength(1)
                    batch.forEach(point => {
                        expect(point.timestamp).not.toBeNull()

                        const expectWithHostname = {
                            service: 'test',
                            a: 'b',
                            hostname: point?.tags?.hostname,
                        }

                        expect(point.tags).toStrictEqual(expectWithHostname)
                        expect(point.fields).toStrictEqual({time: 5})
                    })
                    return Promise.resolve()
                }
            }
        }(defaultParameters)

        await writer.writePoint('test', {a: 'b'}, {time: 5})
    })

    it('write 1001 requests to influx - we should properly rotate counter', () => {
            // expect.assertions(1);
            const mock = jest.fn()
            const writer = new class extends InfluxWriter {
                _counter = 1000;
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                _influx = { writePoints: mock }
            }(defaultParameters)
            writer.writePoint('test', {a: 'b'}, {time: 5})
            expect(writer._counter).toBe(1)
        }
    )
})
