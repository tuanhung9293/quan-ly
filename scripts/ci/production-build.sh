#!/usr/bin/env bash

COMMIT_SHA=`git rev-parse HEAD`
docker build --no-cache -f app/quanly/Dockerfiles/ci-test -t quanly-server-production:$COMMIT_SHA .
