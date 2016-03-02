"use strict";

var faker = require('faker');
var assert = require('assert');

var COLLECTION = {
    PRODUCT: 'products',
    CUSTOMER: 'customers',
    ORDER: 'orders'
};

function getCollection(db, name) {
    return new Promise(function (fulfill, reject) {
        db.collection(name, function (err, data) {
            if (err) {
                return reject(err);
            }
            fulfill(data);
        });
    });
}

function generateCustomer() {
    var firstName = faker.name.firstName();
    var lastName = faker.name.lastName();
    return {
        name: firstName,
        surname: lastName,
        phones: [faker.phone.phoneNumber()],
        address: faker.address.streetAddress()
    }
}

function generateProduct() {
    var product = {
        name: faker.commerce.productName(),
        producer: faker.company.companyName(),
        price: faker.commerce.price()
    };
    var properties = {
        size: faker.random.number(),
        weight: faker.random.number(),
        material: faker.commerce.productMaterial(),
        color: faker.commerce.color(),
        department: faker.commerce.department()
    };
    Object.keys(properties).forEach(function (key) {
        product[key] = properties[key];
    })
    return product;
}

function getRandomElement(elements) {
    return elements[Math.floor(Math.random() * elements.length)]
}

function containsId(elements, id) {
    return elements.reduce(function (memo, item) {
        return memo || (item._id === id);
    }, false);
}

function generateOrder(customers, products, neededProducts) {
    if (neededProducts === undefined) {
        neededProducts = 5;
    }
    var customer = getRandomElement(customers);
    var customerProducts = [];
    for (var i = 0; i < neededProducts; i++) {
        var currentProduct = getRandomElement(products);
        if (!containsId(customerProducts, currentProduct._id)) {
            customerProducts.push(currentProduct);
        }
    }
    var order = {
        order_number: faker.random.number(),
        date: faker.date.past(),
        total_sum: customerProducts.reduce(function (memo, item) {
            return memo + item.price;
        }, 0),
        customer: customer,
        payment: {
            card_owner: [customer.name, customer.surname].join(' '),
            cardId: faker.finance.account()
        },
        payment: customer.payment,
        order_items_id: customerProducts.map(function (item) {
            return {
                "$ref": COLLECTION.PRODUCT,
                "$id": item._id
            };
        })
    };
    return order;
}

function generateItems(collection, amount, generator) {
    var products = [];
    for (var i = 0; i < amount; i++) {
        products.push(generator());
    }
    return new Promise(function (fulfill, reject) {
        collection.insert(products, function (err, data) {
            if (err) {
                return reject(err);
            }
            fulfill(data);
        });
    });
}

function createCollections(db) {
    var pCustomer = new Promise(function (fulfill, reject) {
        db.collection(COLLECTION.CUSTOMER, function (err, collection) {
            if (err) {
                return reject(err);
            }
            fulfill(collection);
        });
    }).then(function (collection) {
        return generateItems(collection, 10, generateCustomer);
    });

    var pProduct = new Promise(function (fulfill, reject) {
        db.collection(COLLECTION.PRODUCT, function (err, collection) {
            if (err) {
                return reject(err);
            }
            fulfill(collection);
        });
    }).then(function (collection) {
        return generateItems(collection, 100, generateProduct);
    });

    return Promise.all([pCustomer, pProduct]).then(function (value) {
        assert.equal(value.length, 2);
        return new Promise(function (fulfill, reject) {
            db.collection(COLLECTION.ORDER, function (err, collection) {
                if (err) {
                    return reject(err);
                }
                fulfill({
                    collection: collection,
                    customers: value[0].ops,
                    products: value[1].ops
                });
            });
        })
    }).then(function (data) {
        return generateItems(data.collection, 100, generateOrder.bind(null, data.customers, data.products, 10));
    }, function (err) {
        console.error(err);
    });
}

module.exports = createCollections;
