// top N
db.orders.mapReduce(function () {
    this.order_items_id.forEach(function (item) {
        emit(item, 1);
    });
}, function (key, values) {
    return Array.sum(values);
}, {out: 'top_products'});
db.top_products.find().sort({value: -1}).limit(10).map(function (item) {
    return {
        item: item._id.fetch(),
        count: item.value
    };
});

// Producers count
db.products.mapReduce(function () {
    emit(this.producer, 1)
}, function (key, values) {
    return Array.sum(values)
}, {out: 'producers_counts'});
db.producers_counts.find().sort({value: -1}).limit(10);

// Producers price
db.products.mapReduce(function () {
    emit(this.producer, this.price)
}, function (key, values) {
    return Array.sum(values)
}, {out: 'producers_prices'});
db.producers_prices.find().sort({value: -1}).limit(10);

// Order price per customer
db.orders.mapReduce(function () {
    // Works with and without _id
    emit(this.customer._id, this.total_sum);
}, function (key, values) {
    return Array.sum(values);
}, {out: 'orders_prices'});
db.orders_prices.find().sort({value: -1}).limit(10);

// Order price per customer with date
db.orders.mapReduce(function () {
    // Works with and without _id
    this.date > new Date('2015-09-01') && this.date < new Date('2015-12-01') && emit(this.customer._id, this.total_sum);
}, function (key, values) {
    return Array.sum(values);
}, {out: 'orders_prices_date'});
db.orders_prices_date.find().sort({value: -1}).limit(10);

// Average order price
db.orders.mapReduce(function () {
    emit(0, this.total_sum);
}, function (key, values) {
    return Array.sum(values) / values.length;
}, {out: 'orders_prices_average'});
db.orders_prices_average.find().sort({value: -1}).limit(10);

// Product customers
db.orders.mapReduce(function () {
    var cid = this.customer._id;
    this.order_items_id.forEach(function (item) {
        emit(item.$id, {
            customers: [cid]
        });
    });
}, function (key, values) {
    return {
        customers: [].concat(values.map(function (item) {
            return item.customers[0];
        }))
   };
}, {out: 'products_customers'});
db.products_customers.find().sort({'value.customers.$size': -1}).limit(10);
db.products_customers.find({$where: "this.value.customers.length > 1"}).limit(10);
// Aggregate, doesnt' work for me
db.products_customers.aggregate([{
    $project: {
        _id: 1, n: {
            $size: 'value.customers'
        }
    },
    $sort: {
        n: -1
    }
}]);

