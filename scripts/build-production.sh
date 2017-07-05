#!/usr/bin/env bash

docker build -f app/quanly/Dockerfiles/build-production -t quanly-server-build-production .
docker run -v $PWD/app/quanly/build:/code/build -e NODE_ENV=production -e CONTAINER_RUN=server quanly-server-build-production
