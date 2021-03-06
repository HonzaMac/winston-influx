import Transport from "winston-transport"
import { writePoint } from "./global"
import InfluxWriter from "./InfluxWriter"


export default class InfluxTransport extends Transport {
    private readonly _writeFn: any
    constructor(writer: InfluxWriter) {
        super();
        this._writeFn = writer ? writer.writePoint.bind(writer) : writePoint;
    }

    log(info: any, next: () => void) {
        setImmediate(() => {
            this.emit('logged', info);
        });

        this._writeFn(
            'log',
            {
                level: info.level
            },
            {
                message: info.message,
            }
        );

        next();
    }
}
