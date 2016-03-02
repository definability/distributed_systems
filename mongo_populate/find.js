"use strict";

var assert = require('assert');

var COLLECTION = require('./constants').COLLECTION;

function getCollection(db, name) {
    return new Promise(function (fulfill, reject) {
        db.collection(name, function (err, data) {
            if (err) {
                console.error('Error getting');
                return reject(err);
            }
            fulfill(data);
        });
    });
}

function showFound (limit, cursor) {
    return new Promise(function (fulfill, reject) {
        cursor.limit(limit).each(function (err, doc) {
            if (err) {
                return reject(err);
            }
            if (doc) {
                console.dir(doc);
            } else {
                fulfill(cursor);
            }
        });
    });
}

function countFound (cursor) {
    return new Promise(function (fulfill, reject) {
        cursor.count(function (err, count) {
            if (err) {
                return reject(err);
            }
            console.log('Amount is', count);
            fulfill(cursor);
        });
    });
}

function getCursor (collection) {
    return new Promise(function (fulfill, reject) {
        collection.find(function (err, cursor) {
            if (err) {
                reject(err);
            }
            console.log('Pick entries');
            fulfill(cursor);
        });
    });
}

function getInBounds (property, lowerBound, upperBound, collections) {
    var collection = collections[COLLECTION.PRODUCT];
    var filter = {};
    filter[property] = {};
    if (!!lowerBound || lowerBound === 0) {
        filter[property]["$gt"] = lowerBound;
    }
    if (!!upperBound || upperBound === 0) {
        filter[property]["$lt"] = upperBound;
    }
    return new Promise(function (fulfill, reject) {
        collection.find(filter, function (err, data) {
            if (err) {
                return reject(err);
            }
            console.log(['Pick by', property, 'from', lowerBound, 'to', upperBound].join(' '));
            fulfill(data);
        });
    });
}

function findByCategory(key, value, collections) {
    var collection = collections[COLLECTION.PRODUCT];
    var query = {};
    query[key] = value;
    return new Promise(function (fulfill, reject) {
        collection.find(query, function (err, data) {
            if (err) {
                return reject(err);
            }
            console.log(['Pick where', key, 'is', value].join(' '));
            fulfill(data);
        })
    })
}

module.exports.getCollection = getCollection;
module.exports.showFound = showFound;
module.exports.countFound = countFound;
module.exports.getCursor = getCursor;
module.exports.getInBounds = getInBounds;
module.exports.findByCategory = findByCategory;

