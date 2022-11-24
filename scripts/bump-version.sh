#!/bin/sh

yarn version --new-version $1 
yarn workspaces foreach exec yarn version --new-version $1 --no-git-tag-version
git commit -a -m ":bookmark: bump to v${1}"
git push
