NODE_NAME=""

[[ ! -z "$1" ]] && NODE_NAME="--name $1"

docker run --rm ${NODE_NAME} --link hazelcast:hazelcast \
           -e JAVA_OPTS="-Dhazelcast.config=/opt/hazelcast/configFolder/hazelcast.xml" \
           -v $(pwd)/configFolder:/opt/hazelcast/configFolder \
           hazelcast/hazelcast

