#!/bin/bash

# Dont do anything if not on a release branch
if [[ -z "${TRAVIS_TAG}" ]]; then
  exit 0
fi
if ![[ "${TRAVIS_TAG}" == release-* ]]; then
  exit 0
fi

folder=$1
if [[ -z "${folder}" ]]; then
  folder=$(pwd)
fi

echo "Publishing package in folder ${folder}"
cd ${folder}


if [[ -z "${NPM_TOKEN}" ]]; then
  echo "NPM_TOKEN not set. Cannot publish package."
  exit
fi

# Extract release version.
# Ex: release-1.0.0 -> 1.0.0
VERSION=$(echo $TRAVIS_TAG | sed s/release-//g)

# Replace version in package.json
# with VERSION
search='("version":[[:space:]]*").+(")'
replace="\1${VERSION}\2"
sed -i ".tmp" -E "s/${search}/${replace}/g" "package.json"
rm "package.json.tmp"

# Authenticate to NPM registry
# NPM_TOKEN should be set in travis
echo //registry.npmjs.org/:_authToken=${NPM_TOKEN} > .npmrc

npm publish
