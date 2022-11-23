#!/bin/sh

yarn version --new-version $1
git commit -a -m ':bookmark: bump package.json'
git push
