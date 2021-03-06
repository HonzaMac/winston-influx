import Transport from 'winston-transport'
import { writePoint } from './global'
import InfluxWriter from './InfluxWriter'
import { TransformableInfo } from 'logform'


export default class InfluxTransport extends Transport {
    private readonly _writeFn: (measurement: string, tags: Record<string, string> , fields: Record<string, unknown> , time?: Date) => void
    constructor(writer: InfluxWriter) {
        super()
        this._writeFn = writer ? writer.writePoint.bind(writer) : writePoint
    }

    log(info: TransformableInfo, next: () => void): void {
        setImmediate(() => {
            this.emit('logged', info)
        })

        this._writeFn(
            'log',
            {
                level: info.level
            },
            {
                message: info.message,
            }
        )

        next()
    }
}
