#!/bin/sh
DIRECTORY="node_modules"
OUT_DIRECTORY="dist"

if [ ! -d "$DIRECTORY" ]; then
  echo "install dependencies"
  yarn install
fi


  rm -rf dist
  echo "build packages"
  yarn build
  cp package.json dist
  cd dist
  yarn unlink
  yarn link
