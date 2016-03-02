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

function getCursor (collection) {
    return new Promise(function (fulfill, reject) {
        collection.find(function (err, cursor) {
            if (err) {
                reject(err);
            }
            fulfill(cursor);
        });
    });
}

module.exports.getCollection = getCollection;
module.exports.showFound = showFound;
module.exports.getCursor = getCursor;

