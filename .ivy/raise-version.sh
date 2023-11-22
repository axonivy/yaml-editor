#!/bin/bash

yarn install --ignore-scripts
yarn lerna version ${1/-SNAPSHOT/-next} --no-git-tag-version --no-push --ignore-scripts --exact --yes
yarn install --ignore-scripts
