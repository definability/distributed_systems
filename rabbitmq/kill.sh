#!/bin/bash

NODES=${1:-1}
MASTER=${2:-rabbit}

for i in $(seq $NODES)
do
    docker stop "rabbit$i" && docker rm "rabbit$i" && \
    docker exec ${MASTER} rabbitmqctl forget_cluster_node rabbit@rabbit$i &
done
wait

exit 0

