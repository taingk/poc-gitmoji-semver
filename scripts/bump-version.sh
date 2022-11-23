#!/bin/sh

yarn version --new-version $1
git commit -a -m ":bookmark: bump to v${1}"
git push
