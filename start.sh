#!/bin/sh

cd ./images/quanly-server-based/
docker build -t quanly-server-based .
cd ../../
docker-compose build
docker-compose up -d
