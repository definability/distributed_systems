'use strict';

var RabbitClient = require('./RabbitClient');

var summationClient = new RabbitClient(null, 'sum_queue');

function summarize (products) {
    summationClient.connect().then(() => {
        summationClient.createChannel().then((ch) => {
            summationClient.rpc(JSON.stringify(products), ch, onSum);
        });
    });
}

function onSum (err, response) {
    if (err) {
        console.error(err);
        return;
    }
    console.log(`Final response is ${String(response.content)}`);
    setTimeout(summationClient.close.bind(summationClient), 500);
}

module.exports = summarize;

