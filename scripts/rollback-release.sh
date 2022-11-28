#!/bin/sh

echo "Input the release to delete (ex: '1.0.1'):"
read from
echo "Input the release to go back to (ex: '1.0.0'):"
read to

read -p "Do you want to from $from to $to? (y/n) " yn

case $yn in 
	[yY] ) echo Rollbacking...;
    git push --delete origin v$from
    git tag --delete v$from
    yarn workspaces foreach exec yarn version $to
    git add ':(glob)**/package.json' .yarn/versions
    git commit -m ":bookmark: rollback to v${to}"
    git push
		break;;
	[nN] ) echo exiting...;
		exit;;
	* ) echo invalid response;;
esac