const {EventEmitter} = require('events');

/**
 * @typedef {Object} IBatcherOptions
 * @property {Number} [interval=10] The flush interval in seconds. If you set this value then the batch will be flushed
 *      on a regular interval
 * @property {Number} [batchSize=5000] The maximum batch size. If the batch has reached this size it will be flushed.
 *      If you have set an 'interval' and this interval has not yet been reached, the batch is flushed anyway.
 */

/**
 * Batcher provides a way to batch a lot of inputs into groups. It has two mechanisms to do this.
 * The first mechanism is to set the 'batchSize' option to the maximum desired size of a single batch. When the buffer
 * has reached this size it will flush the batch.
 * The second option is to set the 'interval' option. If this option is set the batch will be flushed when either
 * maximum batch size is reached or the interval has passed.
 * @type {module.Batcher}
 * @example
 * const {Batcher} = require('@scriptinator/winston-influx');
 *
 * let batch = new Batcher({interval: 10});
 *
 * batch.on('flush', function(data) {
 *   console.log('Here is a large array of data!');
 *   console.log(data);
 * });
 *
 * for(let i = 0; i < 5000; i++) {
 *   batch.write(i);
 * }
 */
module.exports = class Batcher extends EventEmitter {
    /**
     * Create a new Batcher and, if the 'interval' option is supplied, start the interval timer.
     * @param {IBatcherOptions} [options={batchSize: 5000, interval: 0}]
     */
    constructor(options = {}) {
        super();
        /**
         * @type {IBatcherOptions}
         * @private
         */
        this._options = {batchSize: 5000, interval: 0, ...options};

        if (options.interval) {
            /**
             * If the interval options is set, this contains a reference for the set interval
             * @type {number}
             * @private
             */
            this._interval = setInterval(() => this.flush(), options.interval);
        }
        /**
         * @type {Array}
         * @private
         */
        this._batch = [];
    }

    /**
     * Write an item to the batch.
     * @param {*} item
     */
    write(item) {
        this._batch.push(item);
        this.emit('write', item);
        if (this._batch.length >= this._options.batchSize) {
            this.flush();
        }
    }

    /**
     * Flush the current batch. If the batch is empty, this method does nothing.
     */
    flush() {
        if (this._batch.length > 0) {
            this.emit('flush', this._batch);
            this._batch = [];
        }
    }

    /**
     * Stop the interval timer.
     */
    close() {
        if (this._interval) {
            clearInterval(this._interval);
        }
    }
};