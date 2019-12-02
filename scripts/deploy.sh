#!/bin/bash

if [ $(git rev-parse --abbrev-ref HEAD) !=  'master' ]; then
    echo 'You must be on master to deploy'
    exit 1
fi

# Uncommited Changes - Exit script if there uncommited changes
if ! git diff-index --quiet HEAD --; then
    echo "There are uncommited changes on this repository."
    exit 1
fi

REMOTE_DEV=git@git.wpengine.com:production/takwimutech.git
REMOTE_PROD=git@git.wpengine.com:production/takwimu.git

if [ "$ENV" == 'production' ]; then
    REMOTE=$REMOTE_PROD
else
    NODE_ENV='development'
    REMOTE=$REMOTE_DEV
fi

echo "Deploying to remote: $REMOTE"

branch_name='deploy'
{
    git checkout -b $branch_name &&
    
    [ -d "./package" ] && rm -rf ./package ||
    
    git subtree add --prefix package $REMOTE master --squash &&
    
    # Remote exists - Exit script if remote does not exist
    git ls-remote --exit-code ${remote} >/dev/null 2>&1
    if [ $? -ne 0 ]
    then
        echo "Remote ${remote} does not exist"

        git checkout master
        git branch -D $branch_name

        exit 1
    fi

    yarn build &&
    
    yarn pack:dashboard &&
    
    git add package && git commit -m 'Dashboard' &&
    
    git subtree push --prefix package $REMOTE master &&
    
    git checkout master &&
    
    git branch -D $branch_name &&
    
    [ -d "./package" ] && rm -rf ./package ||
    
    echo Done
    } || {
    if [ $(git branch | sed -n '/\* /s///p') == $branch_name ]; then
        git checkout master
        git branch -D $branch_name
    fi
}
