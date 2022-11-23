#!/bin/sh

yarn version --new-version $1
git commit -a
git push
