#!/bin/bash

REGISTRY="https://npmjs-registry.ivyteam.ch/"

npm unpublish "@axonivy/variable-editor@${1}" --registry $REGISTRY
npm unpublish "@axonivy/variable-editor-protocol@${1}" --registry $REGISTRY
