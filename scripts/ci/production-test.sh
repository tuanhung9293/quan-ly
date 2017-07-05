#!/usr/bin/env bash

COMMIT_SHA=`git rev-parse HEAD`
docker run -e NODE_ENV=production -e CONTAINER_RUN=ci -e Company=test quanly-server-production:$COMMIT_SHA
