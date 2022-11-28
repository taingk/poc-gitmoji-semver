#!/bin/sh

yarn workspaces foreach exec yarn version $1
git add ':(glob)**/package.json' .yarn/versions
git commit -m ":bookmark: bump to v${1}"
git push
