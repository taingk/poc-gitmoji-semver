#!/bin/sh

git remote update

UPSTREAM=main
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse "$UPSTREAM")

if [ $LOCAL = $REMOTE ]; then
    if [ -z ${1} ]; then
        echo "\nbranch $UPSTREAM is up-to-date, releasing...\n"
        node scripts/release.js    
    elif [ ${1} = '--dry-run' ]; then
        echo "\nbranch $UPSTREAM is up-to-date, releasing in dry-run mode...\n"
        node scripts/release.js --dry-run
    fi
else
    echo "Not releasing, you need to be up-to-date with $UPSTREAM branch"
fi
