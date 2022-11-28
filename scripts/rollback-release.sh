#!/bin/sh

git push --delete origin v$1
git tag --delete v$1
yarn workspaces foreach exec yarn version $2
git add ':(glob)**/package.json' .yarn/versions
git commit -m ":bookmark: rollback to v${2}"
git push
