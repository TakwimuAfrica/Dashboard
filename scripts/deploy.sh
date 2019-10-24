#!/bin/bash

REMOTE_DEV=git@git.wpengine.com:production/takwimutech.git
REMOTE_PROD=git@git.wpengine.com:production/takwimutech.git

if [ "$ENV" == 'production' ]; then
    REMOTE=$REMOTE_PROD
else
    REMOTE=$REMOTE_DEV
fi

echo "Deploying to remote: $REMOTE"

if [ $(git rev-parse --abbrev-ref HEAD) !=  'master' ]; then
    echo 'You must be on master to deploy'
else
    prev_npm_package_version=$npm_package_version
    {
        git checkout -b $prev_npm_package_version &&
        
        yarn version &&
        
        new_npm_package_version=$npm_package_version &&
        
        [ -d "./package" ] && rm -rf ./package ||
        
        git subtree add --prefix package \"$REMOTE\" master --squash &&
        
        yarn build &&
        
        yarn pack:dashboard &&
        
        git add package && git commit -m 'dashboard $npm_package_version' &&
        
        git subtree push --prefix package \"$REMOTE\" master &&
        
        git checkout master &&
        
        git branch -D $prev_npm_package_version &&

        git tag -d "v$new_npm_package_version" &&
        
        [ -d "./package" ] && rm -rf ./package ||

        yarn version --new-version $new_npm_package_version &&
        
        git push &&
        
        echo \"Successfully released version $npm_package_version!\"
        } || {
        if [ $(git branch | sed -n '/\* /s///p') == $prev_npm_package_version ]; then
            git checkout master
            git branch -D $prev_npm_package_version
        fi
    }
fi
