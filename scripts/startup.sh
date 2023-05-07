#!/bin/sh

node ace migration:run --force
dumb-init node server.js
