'use strict';

var RabbitClient = require('./RabbitClient');

var summationClient = new RabbitClient(null, 'uni_queue');

function summarize (products) {
    var query = {
        params: [products],
        method: 'lambda x: sum(x)'
    }
    summationClient.connect().then(() => {
        summationClient.createChannel().then((ch) => {
            summationClient.rpc(JSON.stringify(query), ch, onSum);
        });
    });
}

function onSum (err, response) {
    if (err) {
        console.error(err);
        return;
    }
    console.log(`Final response is ${String(response.content)}`);
    var query = {
        params: ['Thank you!'],
        method: 'print'
    }
    summationClient.createChannel().then((ch) => {
        summationClient.rpc(JSON.stringify(query), ch, ()=>{
            setTimeout(summationClient.close.bind(summationClient), 500);
        });
    });
}

module.exports = summarize;

