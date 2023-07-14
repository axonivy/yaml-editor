#!/bin/bash

REGISTRY="https://npmjs-registry.ivyteam.io/"

npm unpublish "@axonivy/config-editor@${1}" --registry $REGISTRY
