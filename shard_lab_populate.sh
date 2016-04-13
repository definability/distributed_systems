sudo docker run -t -i --rm --name m_client mongo mongo 172.17.0.6:27000 --eval "
sh.addShard('172.17.0.3:27000')
sh.addShard('172.17.0.4:27000')
sh.addShard('172.17.0.5:27000')
"

sudo docker run -t -i --rm --name m_client mongo mongo 172.17.0.6:27000/config --eval "
db.settings.save({
    _id: 'chunksize',
    value: 1
});
"

sudo docker run -t -i --rm --name m_client mongo mongo 172.17.0.6:27000/distributed_storage --eval "
function getZone (n) {
    if (n < 1./3) return 'Kiev';
    else if (n < 2./3) return 'Lvov';
    else return 'Donetsk';
}

var ITEMS_AMOUNT = 40000;
for (var i=0; i<ITEMS_AMOUNT; i++) {
    if (i % 1000 === 0) {
        print(i, 'items of', ITEMS_AMOUNT, 'created');
    }
    db.user_data.insert({
        data: Math.round((Math.random()-.5)*2),
        zone: getZone(Math.random())
    });
}

db.user_data.ensureIndex({zone: 1, data: 1});
db.user_data.stats();
"

sudo docker run -t -i --rm --name m_client mongo mongo 172.17.0.6:27000/admin --eval "
sh.enableSharding('distributed_storage');
db.runCommand({
    shardCollection: 'distributed_storage.user_data',
    key: {
        zone: 1,
        data: 1
    }
});
"

sudo docker run -t -i --rm --name m_client mongo mongo 172.17.0.6:27000/distributed_storage --eval "db.printShardingStatus();"

