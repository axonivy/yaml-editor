#!/bin/bash
set -e

mvn --batch-mode versions:set-property versions:commit -f playwright/projects/connector/pom.xml -Dproperty=project.build.plugin.version -DnewVersion=${2} -DallowSnapshots=true
mvn --batch-mode versions:set-property versions:commit -f playwright/projects/variables-test-project/pom.xml -Dproperty=project.build.plugin.version -DnewVersion=${2} -DallowSnapshots=true

