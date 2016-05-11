'use strict';

var multiply = require('./multiply');
var summarize = require('./summarize');

if (process.argv.length < 3) {
    return;
}

var tasks = Math.round(process.argv[2]);
var length = 1;
if (tasks !== tasks || tasks <= 0) {
    return;
}
if (process.argv.length > 3) {
    length = Math.round(process.argv[3]);
}
if (length !== length || length <= 0) {
    return;
}

multiply(tasks, length, (err, products) => {
    if (err) {
        return;
    }
    summarize(products);
});

