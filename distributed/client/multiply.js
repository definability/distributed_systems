'use strict';

var RabbitClient = require('./RabbitClient');

var multiplicationClient = new RabbitClient(null, 'mul_queue');

function multiply (vectors, length, callback) {
    multiplicationClient.connect().then(() => {
        let promises = [];
        for (let i=0; i<vectors; i++) {
            promises.push(multiplicationClient.createChannel());
        }
        Promise.all(promises).then(send.bind(null, callback, length, 0, 10, true));
    }, console.error);
}

function send (callback, length, min, max, integer, channels) {
    var promises = [];
    channels.forEach((ch) => {
        let v1 = generateArray(length, min, max, integer);
        let v2 = generateArray(length, min, max, integer);
        console.log(`Multiply ${JSON.stringify(v1)} by ${JSON.stringify(v2)}`);
        promises.push(new Promise(createMulPromise.bind(null,
                                  multiplicationClient, [v1, v2], ch)));
    });
    Promise.all(promises).then((response) => {
        var products = response.map((item) => Number(JSON.parse(item.content)));
        onMul(products, callback);
    }, callback);
}

function createMulPromise (multiplicationClient, vectors, channel, fulfill, reject) {
    multiplicationClient.rpc(JSON.stringify(vectors), channel, (err, result) => {
        if (err) {
            return reject(err);
        }
        return fulfill(result);
    });
}

function onMul (products, callback) {
    console.log(`Got ${JSON.stringify(products)}`);
    setTimeout(multiplicationClient.close.bind(multiplicationClient), 500);
    callback(null, products);
}

function generateArray (n, min, max, integers) {
    min = min || 0;
    max = max || 1;
    integers = !!integers;
    var result = [];
    for (let i=0; i<n; i++) {
        result.push(Math.random() * (max - min) + min);
        if (integers) {
            result[i] = Math.round(result[i]);
        }
    }
    return result;
}

module.exports = multiply;

