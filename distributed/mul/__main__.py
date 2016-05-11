#!/usr/bin/env python
from pika import BlockingConnection, ConnectionParameters
from sys import argv
from src.remote_greeting import on_request

DEFAULT_QUEUE = 'mul_queue'
DEFAULT_HOST = 'rabbit'

connection = BlockingConnection(ConnectionParameters(host=DEFAULT_HOST))

channel = connection.channel()
channel.queue_declare(queue=DEFAULT_QUEUE)
channel.basic_qos(prefetch_count=1)

channel.basic_consume(on_request, queue=DEFAULT_QUEUE)

prefix = ''
if len(argv) > 1:
    prefix = ' with delay {}'.format((float(argv[1])))
print(' [x] Awaiting RPC requests{}'.format(prefix))
channel.start_consuming()

