#!/usr/bin/env bash

COMMIT_SHA=`git rev-parse HEAD`
docker build -f app/quanly/Dockerfiles/build-production -t quanly-server-build-production .
docker run \
    -v $PWD/app/quanly/build:/code/build \
    -e NODE_ENV=production \
    -e CONTAINER_RUN=server \
    quanly-server-build-production
docker build -f app/quanly/Dockerfiles/production -t quanly-server:$COMMIT_SHA .
docker tag quanly-server:$COMMIT_SHA docker-registry.ntworld.net/quanly-server:$COMMIT_SHA
docker tag quanly-server:$COMMIT_SHA docker-registry.ntworld.net/quanly-server:latest
docker push docker-registry.ntworld.net/quanly-server:$COMMIT_SHA
docker push docker-registry.ntworld.net/quanly-server:latest

