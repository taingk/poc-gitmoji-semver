#!/bin/sh

yarn workspaces foreach exec yarn version $1
git commit -a -m ":bookmark: bump to v${1}"
git push
