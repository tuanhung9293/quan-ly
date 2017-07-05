#!/usr/bin/env bash

function startup {
    cd /code

    wait-for-mongo mongodb://172.16.237.67:27017 90000
}

if [ "$NODE_ENV" = "test" ]; then
    startup
    npm run-script test
else
    if [ "$CONTAINER_RUN" = "ui" ]; then
        npm run-script ui-dev
    elif [ "$CONTAINER_RUN" = "server-build" ]; then
        npm run-script build-server-dev
    elif [ "$CONTAINER_RUN" = "server-stable" ]; then
        startup
        npm run-script server-dev
    else
        startup
        nodemon -w /code/src/main.js -w /code/src/main.js.map ./src/main.js
    fi
fi
