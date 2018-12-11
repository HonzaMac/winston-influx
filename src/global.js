const InfluxWriter = require('./InfluxWriter');
let globalWriter = null;

module.exports = {
    connect: function (options) {
        globalWriter = new InfluxWriter(options);
    },
    writePoint: function (measurement, tags, fields, time = new Date()) {
        if (globalWriter) {
            globalWriter.writePoint(measurement, tags, fields, time);
        }
    }
};
