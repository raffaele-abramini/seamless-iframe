#!/usr/bin/env bash

v=$1
originalVersion=`cat ./package.json`
jq --arg v $v '.version = $v' <<<"$originalVersion" > package.json