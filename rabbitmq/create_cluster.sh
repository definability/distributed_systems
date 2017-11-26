#!/bin/bash
set -e

MASTER=$1

rabbitmqctl stop_app
rabbitmqctl join_cluster rabbit@${MASTER}
rabbitmqctl start_app

