const {connect, writePoint} = require('./global');
const InfluxWriter = require('./InfluxWriter');
const Batcher = require('./Batcher');
const InfluxTransport = require('./InfluxTransport');

module.exports = {
    InfluxWriter,
    InfluxTransport,
    Batcher,
    connect,
    writePoint
};
