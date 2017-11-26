# Distributed computing

Distributed computing via RabbitMQ 3, NodeJS 6, Python 3

# Run Docker

Need to run `RabbitMQ` Docker
```bash
docker run --rm --name rabbit rabbitmq:3
```

Folders `universal` and `client` contain file `docker.sh`.
Run as much `universal` dockers and run applications within via
```bash
python .
```
as you need servers to multiply or sum vectors provided by client.

# Client

Execute client with parameters
```bash
node index.js ${PAIRS_AMOUNT} ${VECTOR_LENGTH}
```

- `PAIRS_AMOUNT` is an amount of needed dot products of vectors;
- `VECTOR_LENGTH` is a length of each vector.

Client will send queries to multiply vectors,
and then final query to summarize will be sent.

