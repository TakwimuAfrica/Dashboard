# Takwimu Dashboard

## Development
We use a docker-based environment for development making use of [wordpress]() and [mysql]() docker images.

To get started, clone this repository and spin up docker-container as shown below

```shell
git clone git@github.com:TakwimuAfrica/Dashboard.git
cd Dashboard
docker-compose up
```

Once containers are up, visit `http:localhost:8080` and follow instructions for further installation of wordpress.

Takwimu Dashboard uses a custom react plugin called `hurumap`. So we have to build `hurumap` before we can activate it on wordpress.

```shell
cd wp-content/plugins/hurumap
yarn build
```




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
