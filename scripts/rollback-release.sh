#!/bin/sh

git push --delete origin $1
git tag --delete $1
yarn workspaces foreach exec yarn version $1
git add ':(glob)**/package.json' .yarn/versions
git commit -m ":bookmark: rollback to v${1}"
git push
