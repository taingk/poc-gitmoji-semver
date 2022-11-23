#!/bin/sh

yarn version --new-version $1
git status
git add .
git commit --amend --no-edit
git push -f
