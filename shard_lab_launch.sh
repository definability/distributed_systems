sudo docker run       --name m_config -p 27022:27000 -d mongo --port 27000 --configsvr
sudo docker run       --name m_shard0 -p 27018:27000 -d mongo --port 27000
sudo docker run       --name m_shard1 -p 27019:27000 -d mongo --port 27000
sudo docker run       --name m_shard2 -p 27020:27000 -d mongo --port 27000
sudo docker run -t -i --name mongos   -p 27000:27000 -d mongo mongos --configdb 172.17.0.2:27000 --port 27000
sudo docker logs -f          mongos

