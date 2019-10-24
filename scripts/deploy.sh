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
    REMOTE=$REMOTE_DEV
fi

echo "Deploying to remote: $REMOTE"

prev_npm_package_version=$npm_package_version
{
    git checkout -b $prev_npm_package_version &&
    
    [ -d "./package" ] && rm -rf ./package ||
    
    git subtree add --prefix package $REMOTE master --squash &&
    
    # Remote exists - Exit script if remote does not exist
    git ls-remote --exit-code ${remote} >/dev/null 2>&1
    if [ $? -ne 0 ]
    then
        echo "Remote ${remote} does not exist"

        git checkout master
        git branch -D $prev_npm_package_version

        exit 1
    fi
    
    yarn version &&
    
    new_npm_package_version=$npm_package_version &&

    yarn build &&
    
    yarn pack:dashboard &&
    
    git add package && git commit -m 'dashboard $npm_package_version' &&
    
    git subtree push --prefix package $REMOTE master &&
    
    git checkout master &&
    
    git branch -D $prev_npm_package_version &&
    
    git tag -d "v$new_npm_package_version" &&
    
    [ -d "./package" ] && rm -rf ./package ||
    
    yarn version --new-version $new_npm_package_version &&
    
    git push --follow-tags &&
    
    echo \"Successfully released version $new_npm_package_version!\"
    } || {
    if [ $(git branch | sed -n '/\* /s///p') == $prev_npm_package_version ]; then
        git checkout master
        git branch -D $prev_npm_package_version
        git tag -d "v$prev_npm_package_version"
        git tag -d "v$new_npm_package_version"
    fi
}
