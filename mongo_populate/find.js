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
    return cursor.count().then(function (count) {
        console.log('Amount is', count);
    });
}

function getCursor (collection) {
    console.log('Pick entries');
    return collection.find();
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
    console.log(['Pick by', property, 'from', lowerBound, 'to', upperBound].join(' '));
    return collection.find(filter);
}

function findByCategory(key, value, collections) {
    var collection = collections[COLLECTION.PRODUCT];
    var query = {};
    query[key] = value;
    console.log(['Pick where', key, 'is', value].join(' '));
    return collection.find(query)
}

module.exports.getCollection = getCollection;
module.exports.showFound = showFound;
module.exports.countFound = countFound;
module.exports.getCursor = getCursor;
module.exports.getInBounds = getInBounds;
module.exports.findByCategory = findByCategory;

