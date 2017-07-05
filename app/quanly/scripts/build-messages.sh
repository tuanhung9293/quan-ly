#!/bin/sh

export CONTAINER_RUN='build-messages'
cp ./scripts/.babelrc-messages ./.babelrc
./node_modules/.bin/babel -d ./build-messages ./packages ./src ./ui
./node_modules/.bin/babel-node ./scripts/combine-messages.js
rm -R ./tmp-messages
rm -R ./build-messages
rm ./.babelrc
