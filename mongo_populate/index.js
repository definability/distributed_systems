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

var ACTIONS = ['populate', 'find'];
var LIMIT = Number(process.env.LIMIT) || 10;
assert(LIMIT > 0);

MongoClient.connect(url, function(err, db) {
  assert(!err);
  console.log("Connected correctly to server");
  switch (process.env.ACTION) {
      case 'populate': 
            populate(db, AMOUNT).then(function (values) {
                console.log("Disconnect");
                db.close();
            });
          break;
      case 'find':
            var collections = {};
            find.getCollection(db, COLLECTION.PRODUCT).then(function (collection) {
                collections[COLLECTION.PRODUCT] = collection;
                return new Promise(function (fulfill, reject) {
                    fulfill(collection);
                });
            }, function (err) {
                console.error(err);
            })
            .then(find.getCursor, function (err) {
                console.error(err);
            }).then(find.showFound.bind(null, LIMIT), function (err) {
                console.error(err);
            }).then(find.getInBounds.bind(null, 'size', 100, 1000, collections), function (err) {
                console.error(err);
            }).then(find.showFound.bind(null, LIMIT), function (err) {
                console.error(err);
            }).then(find.findByCategory.bind(null, 'department', 'Electronics', collections), function (err) {
                console.error(err);
            }).then(find.countFound.bind(null), function (err) {
                console.error(err);
            }).then(function () {
                console.log("Disconnect");
                db.close();
            });
            break;
      default:
          console.log("ACTION " + process.env.ACTION + " is unavailable. Available are: '" + ACTIONS.join("', '") + "'.");
          db.close();
  }
});

