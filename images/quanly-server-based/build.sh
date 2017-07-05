#!/bin/sh

VERSION=v6

mkdir cache-node-modules
cp ../../app/quanly/yarn.lock    ./cache-node-modules
cp ../../app/quanly/package.json ./cache-node-modules

docker login -u quanly docker-registry.ntworld.net
docker build -t quanly-server-based:$VERSION .
docker tag quanly-server-based:$VERSION docker-registry.ntworld.net/quanly-server-based:$VERSION
docker tag quanly-server-based:$VERSION docker-registry.ntworld.net/quanly-server-based:latest
docker push docker-registry.ntworld.net/quanly-server-based:$VERSION
docker push docker-registry.ntworld.net/quanly-server-based:latest

rm -rf ./cache-node-modules
