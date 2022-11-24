#!/bin/sh

yarn version apply --all $1
git commit -a -m ":bookmark: bump to v${1}"
git push
