#!/bin/bash

clear
if [ -d dist ]; then
    rm -rf dist
fi
npm run build
npm run start
rm -rf dist