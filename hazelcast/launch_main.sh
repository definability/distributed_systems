docker run --rm --name hazelcast -h hazelcast \
    -e JAVA_OPTS="-Dhazelcast.config=/opt/hazelcast/configFolder/hazelcast.xml" \
    -v $(pwd)/configFolder:/opt/hazelcast/configFolder \
    hazelcast/hazelcast

