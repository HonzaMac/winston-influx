const {writePoint} = require('./global');
const Transport = require('winston-transport');

module.exports = class InfluxTransport extends Transport {
    constructor(writer) {
        super();
        this._writeFn = writer ? writer.writePoint.bind(writer) : writePoint;
    }

    log(info, callback) {
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

        callback();
    }
};
