#!/bin/sh
# refs: https://docs.npmjs.com/cli/v10/using-npm/scripts#npm-ci
NODE_COMMON_DIRECTORY="$PWD/../node-common"
if [ ! -d "$NODE_COMMON_DIRECTORY/dist" ]; then
    cd $NODE_COMMON_DIRECTORY
    yarn local:publish
fi