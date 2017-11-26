#!/bin/bash

set -e

NUMBER=$1
COOKIE=$2
MASTER=$3

NAME="rabbit${NUMBER}"

LINKS="--link ${MASTER}:${MASTER}"
for i in $(seq $((NUMBER-1)))
do
    LINKS="$LINKS --link rabbit${i}:rabbit${i}"
done

ID=$(docker run -d $LINKS --name "${NAME}" -h "${NAME}" \
                -e RABBITMQ_ERLANG_COOKIE="${COOKIE}" \
                -e RABBITMQ_NODENAME="rabbit@${NAME}" \
                rabbitmq:3)

docker cp create_cluster.sh "${ID}:/tmp/create_cluster.sh">/dev/null

until docker exec "${ID}" rabbitmqctl status>/dev/null
do
    sleep 1
done

docker exec "${ID}" bash /tmp/create_cluster.sh ${MASTER}>/dev/null

echo $ID
exit 0

