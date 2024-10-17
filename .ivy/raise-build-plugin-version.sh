#!/bin/bash
set -e

mvn --batch-mode versions:set-property versions:commit -f integrations/standalone/tests/integration/projects/connector/pom.xml -Dproperty=project.build.plugin.version -DnewVersion=${2} -DallowSnapshots=true
mvn --batch-mode versions:set-property versions:commit -f integrations/standalone/tests/integration/projects/variables-test-project/pom.xml -Dproperty=project.build.plugin.version -DnewVersion=${2} -DallowSnapshots=true

