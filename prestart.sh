#!/usr/bin/env bash
mongo admin --eval "db.shutdownServer()" > /dev/null
mongod --dbpath ./server/db --fork --logpath /dev/null
