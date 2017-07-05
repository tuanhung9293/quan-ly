#!/usr/bin/env bash

if [ ! -d "/data/mongo" ]; then
    mkdir -p /data/mongo && chown -R mongodb:mongodb /data/mongo
fi
service mongodb start

if [ ! -d "/data/redis" ]; then
    mkdir -p /data/redis && chown redis:redis /data/redis
fi
/etc/init.d/redis-server start

cd /code

wait-for-mongo mongodb://127.0.0.1:27017 90000
wait-for-redis

npm run-script ci-test
