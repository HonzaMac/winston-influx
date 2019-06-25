const Batcher = require('./Batcher.js');
const {InfluxDB, toNanoDate, Precision} = require('influx');
const os = require('os');

/**
 * InfluxWriter batches points and writes them to influxdb.
 * @type {module.InfluxWriter}
 */
module.exports = class InfluxWriter {
    /**
     *
     * @param options
     */
    constructor(options = {}) {
        /**
         * @type {InfluxDB}
         */
        this._influx = new InfluxDB(options);
        /**
         * @type {module.Batcher}
         * @private
         */
        this._batcher = new Batcher(options);
        this._batcher.on('flush', batch => this._flushBatch(batch));
        /**
         * Influx will overwrite points using the same timestamp and tags.
         * To work around this we use this _counter field as the nanosecond
         * segment of the timestamp and increment it every time a point is
         * written. This way it is extremely unlikely that any points are
         * overwritten.
         * @type {number}
         * @private
         */
        this._counter = 0;
        /**
         * @type {Object<String, String>}
         * @private
         */
        this._tags = options.tags || {};
    }

    /**
     * Add a point to the current batch. If this batch has exceeded the maximum batch
     * size it will be flushed.
     *
     * @param {String} measurement The Influx measurement name.
     * @param {Object.<String, String>} tags The list of tag values to insert.
     * @param {Object.<String, *>} fields The list of field values to insert.
     * @param {Date} [time=new Date()] The time for the measurement.
     */
    writePoint(measurement, tags, fields, time = new Date()) {
        this._counter = (this._counter + 1) % 1000;

        this._batcher.write({
            measurement: measurement,
            tags: {hostname: os.hostname(), ...this._tags, ...tags},
            fields: fields,
            timestamp: toNanoDate(
                time.getTime() + '000' + this._counter.toString().padStart(3, '0')
            )
        });
    }

    /**
     * Flush a batch to InfluxDB. This method is triggered by the 'flush' event from Batcher.
     * @param batch
     * @private
     */
    _flushBatch(batch) {
        this._influx.writePoints(batch, {precision: Precision.Nanoseconds})
            .catch(err => console.error(`Failed to write batch to influx: ${err}`));
    }
};
