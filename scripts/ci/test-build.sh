#!/usr/bin/env bash

COMMIT_SHA=`git rev-parse HEAD`
docker build -f app/quanly/Dockerfiles/ci-test -t quanly-server-test:$COMMIT_SHA .
