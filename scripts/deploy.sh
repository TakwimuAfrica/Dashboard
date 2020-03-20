#!/bin/bash

if ! git remote | grep wpprod > /dev/null; then
    echo "Add git remote wpprod"
    exit 1
fi
if ! git remote | grep wpdev > /dev/null; then
    echo "Add git remote wpdev"
    exit 1
fi

if [ $(git rev-parse --abbrev-ref HEAD) !=  'master' ]; then
    echo 'You must be on master to deploy'
    exit 1
fi

# Uncommited Changes - Exit script if there uncommited changes
if ! git diff-index --quiet HEAD --; then
    echo "There are uncommited changes on this repository."
    exit 1
fi

if [ "$ENV" == 'production' ]; then
    NODE_ENV='production'
    REMOTE=wpprod
else
    NODE_ENV='development'
    REMOTE=wpdev
fi

echo "Deploying to remote: $REMOTE"

branch_name=deploy-`date +"%s"`
{
    git checkout -b $branch_name &&
    
    [ -d "./package" ] && rm -rf ./package ||
    
    git subtree add --prefix package $REMOTE master --squash &&
    git fetch &&
    git subtree pull --prefix package $REMOTE master --squash &&
    if ! git diff-index --quiet HEAD --; then
        git add package && git commit -m 'Dashboard'
    fi

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
