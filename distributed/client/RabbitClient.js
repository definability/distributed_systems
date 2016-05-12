'use strict';

var amqp = require('amqplib');
var uuid4 = require('uuid4');
var assert = require('assert');

const DEFAULT_HOST = 'amqp://rabbit';
const DEFAULT_QUEUE = 'rpc_queue';
const TIMEOUT = 50000;

class RabbitClient {
    constructor (host, queue) {
        assert(!host || typeof host === 'string');
        assert(!queue || typeof queue === 'string');
        this._host = host || DEFAULT_HOST;
        this._queue = queue || DEFAULT_QUEUE;
        this._channelsAmount = 0;
        this._channels = [];
        this._queues = [];
    }
    connect () {
        return amqp.connect(this._host).then((connection) => {
            this._connection = connection;
        })
    }
    createChannel () {
        this._channels.push(null);
        this._queues.push(null);
        var i = this._channelsAmount;
        this._channelsAmount++;
        return this._connection.createChannel().then((channel) => {
            this._channels[i] = channel;
            return channel.assertQueue('', {
                exclusive: true
            });
        }).then((queue) => {
            this._queues[i] = queue.queue;
            return new Promise((resolve, reject) => {
                resolve(i);
            });
        });
    }
    close () {
        return this._connection.close();
    }
    rpc (query, i, callback) {
        assert(!!this._channels[i] && !!this._queues[i]);
        assert(typeof query === 'string' && typeof callback === 'function');

        var correlationId = uuid4();

        var timeout = setTimeout(() => {
            this._channels[i].cancel(correlationId);
            callback('Timeout error');
        }, TIMEOUT);

        this._channels[i].consume(this._queues[i], (msg) => {
            consume(this._channels[i], msg, correlationId, timeout, callback);
        }, {
            noAck: true,
            consumerTag: correlationId
        });

        this._channels[i].sendToQueue(this._queue, new Buffer(query), {
            correlationId: correlationId,
            replyTo: this._queues[i],
            expiration: TIMEOUT.toString()
        });
    }
}

function consume (channel, msg, correlationId, timeout, callback) {
    if (msg.properties.correlationId !== correlationId) {
      console.log(` [i] Waiting for ${correlationId} got ${msg.properties.correlationId}`);
      return;
    }
    clearTimeout(timeout);
    channel.cancel(correlationId);
    callback(null, msg);
}

module.exports = RabbitClient;

