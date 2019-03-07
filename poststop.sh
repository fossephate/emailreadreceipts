#!/usr/bin/env bash
mongo admin --eval "db.shutdownServer()" > /dev/null
killall node
