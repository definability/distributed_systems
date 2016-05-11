from sys import argv
from pika import BasicProperties
from time import sleep
import json

def on_request(ch, method, props, body):
    request = json.loads(body.decode('utf-8'))
    print('Got request {}'.format(request))
    if len(argv) > 1:
        sleep(float(argv[1]))
    try:
        response = json.dumps(sum(request))
    except Exception as e:
        response = json.dumps(e)
    print('Sending response {}'.format(response))
    properties = BasicProperties(correlation_id = props.correlation_id)

    ch.basic_publish(exchange='', routing_key=props.reply_to,
                     properties=properties,
                     body=json.dumps(response))
    ch.basic_ack(delivery_tag = method.delivery_tag)

