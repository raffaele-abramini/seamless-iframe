#!/usr/bin/env bash

v=$version
sed "s/version\": \".*\"/version\": \"$version\"/g" package.json > package.json.temp
cat package.json.temp > package.json
rm package.json.temp