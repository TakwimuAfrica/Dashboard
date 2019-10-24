# Takwimu Dashboard

## Deployment

Follow instructions at [WP Engine Git](https://wpengine.com/git/) documentation site to setup your `git push` access for our different environments:

1. Development: `takwimutech`
2. Production: `takwimu`

## Deploy

Auto deploy using command:

- Development: `yarn deploy:dev`
- Production: `yarn deploy:prod`

Manual deployment:

- `git checkout -b <branch name>`
- `git subtree add --prefix package <wp remote> master --squash`
- `yarn build`
- `yarn pack:dashboard`
- `git add package && git commit -m <commit message>`
- `git subtree push --prefix package <wp remote> master`
- `git checkout master`
- `git branch -D <branch name>`
