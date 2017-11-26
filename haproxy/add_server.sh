#!/bin/bash

for name in $SERVERS
do
    echo "    server ${name} ${name}:8080 maxconn 32 check" >> /usr/local/etc/haproxy/haproxy.cfg
done

#echo $@
exec /docker-entrypoint.sh $@

exit 0

