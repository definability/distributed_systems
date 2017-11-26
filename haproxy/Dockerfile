FROM haproxy:1.6

COPY haproxy.cfg /usr/local/etc/haproxy/haproxy.cfg
ENV SERVERS=""
COPY add_server.sh /add_server.sh

ENTRYPOINT ["/add_server.sh"]
CMD ["haproxy", "-f", "/usr/local/etc/haproxy/haproxy.cfg"]

