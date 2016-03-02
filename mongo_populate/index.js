var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var populate = require('./populate');
var find = require('./find');
var COLLECTION = require('./constants').COLLECTION;

// Connection URL
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server

var AMOUNT = {
    customers: 100,
    orders: 1000,
    products_per_order: 10,
    products: 10000
};

var ACTIONS = ['populate', 'findProducts', 'findOrders'];
var LIMIT = Number(process.env.LIMIT) || 10;
assert(LIMIT > 0);

MongoClient.connect(url, function(err, db) {
assert(!err);
console.log("Connected correctly to server");
    var collections = {};
    switch (process.env.ACTION) {
        case 'populate': 
              populate(db, AMOUNT).then(function (values) {
                  console.log("Disconnect");
                  db.close();
              });
            break;
        case 'findProducts':
              find.getCollection(db, COLLECTION.PRODUCT)
              .then(function (collection) {
                  collections[COLLECTION.PRODUCT] = collection;
                  return new Promise(function (fulfill, reject) {
                      fulfill(collection);
                  });
              })
              .then(find.getCursor)
              .then(find.showFound.bind(null, LIMIT))
              .then(find.getInBounds.bind(null, 'size', 100, 1000, collections, COLLECTION.PRODUCT))
              .then(find.showFound.bind(null, LIMIT))
              .then(find.findByCategory.bind(null, 'department', 'Electronics', collections, COLLECTION.PRODUCT))
              .then(find.countFound.bind(null))
              .then(find.getValues.bind(null, 'department', collections, COLLECTION.PRODUCT))
              .then(function (data) {
                  console.dir(data);
              }).then(function () {
                  console.log("Disconnect");
                  db.close();
              }).catch(function (err) {
                  console.error(err);
                  console.log("Disconnect");
                  db.close();
              });
              break;
        case 'findOrders':
              find.getCollection(db, COLLECTION.ORDER)
              .then(function (collection) {
                  collections[COLLECTION.ORDER] = collection;
                  return new Promise(function (fulfill, reject) {
                      fulfill(collection);
                  });
              })
              .then(find.getCursor)
              .then(find.showFound.bind(null, LIMIT))
              .then(find.getInBounds.bind(null, 'total_sum', 100, 1000, collections, COLLECTION.ORDER))
              .then(function () {
                  console.log("Disconnect");
                  db.close();
              }).catch(function (err) {
                  console.error(err);
                  console.log("Disconnect");
                  db.close();
              });
              break;
        default:
            console.log("ACTION " + process.env.ACTION + " is unavailable. Available are: '" + ACTIONS.join("', '") + "'.");
            db.close();
    }
});

