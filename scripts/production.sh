#!/usr/bin/env bash

docker build -f app/quanly/Dockerfiles/production -t quanly-server-production .
docker run -v $PWD/data:/data -p 127.0.0.1:60001:60001 -e NODE_ENV=production -e CONTAINER_RUN=server quanly-server-production
