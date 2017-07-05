#!/bin/sh

TEST=$1

docker exec -t quanly-dev-server lab -I __core-js_shared__ -S -T node_modules/lab-babel ./test/$1
