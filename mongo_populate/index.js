var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var populate = require('./populate');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert(!err);
  console.log("Connected correctly to server");
  populate(db).then(function (values) {
      console.log("Disconnect");
      db.close();
  });
});

