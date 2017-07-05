#!/usr/bin/env bash

BASED_NAME="$1"
COMPANY="$2"
PORT="$3"

echo "Start deploy for $COMPANY, image $BASED_NAME at port $PORT"

DOCKER_PID=`docker ps -a -q --filter name=$BASED_NAME-$COMPANY --format="{{.ID}}"`
if [ ${#DOCKER_PID} -ge 12 ]; then
    echo "stopping $DOCKER_PID..."
    docker stop $DOCKER_PID
    docker rm $DOCKER_PID
    echo "stopped $DOCKER_PID"
fi

sudo /root/mk-data-dir.sh $COMPANY
docker run -d \
    -v /root/data/$COMPANY:/data \
    -p 127.0.0.1:$PORT:60001 \
    -e NODE_ENV=production \
    -e CONTAINER_RUN=server \
    -e COMPANY=$COMPANY \
    --name $BASED_NAME-$COMPANY \
    docker-registry.ntworld.net/quanly-server:latest
