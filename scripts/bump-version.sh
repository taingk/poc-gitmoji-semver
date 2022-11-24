#!/bin/sh

yarn version --new-version --all $1
git commit -a -m ":bookmark: bump to v${1}"
git push
