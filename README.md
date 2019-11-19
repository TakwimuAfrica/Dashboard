# Takwimu Dashboard

## Development
We use a docker-based environment for development making use of [wordpress](https://hub.docker.com/_/wordpress/) and [mysql](https://hub.docker.com/_/mysql) docker images.

To get started, clone this repository and spin up docker-containers as shown below. Refer to [docker-compose.yml](https://github.com/TakwimuAfrica/Dashboard/blob/master/docker-compose.yml) file

```shell
git clone git@github.com:TakwimuAfrica/Dashboard.git
cd Dashboard
docker-compose up
```

Once containers are up, visit `http:localhost:8080` and follow instructions for further installation of wordpress.

Takwimu Dashboard uses a custom react javascript plugin called `hurumap`. HURUmap plugin allows you to define `HURUmap charts`, `Flourish Charts`, & `Chart Sections` and enable you to add charts to post/page content using [gutenberg editor](https://wordpress.org/gutenberg/).

`hurumap` build file is enqueued to the admin screen during activation. So we have to build `hurumap` code before we can activate it on wordpress.

```shell
cd wp-content/plugins/hurumap
yarn build
```

You can now navigate to wordpress dashboard `http:localhost:8080/wp-admin` and log in.

Once you're logged in,

1. Activate `hurumap` theme under `Appearance` -> `Themes` from wordpress dashboard menu. 
2. Activate `hurumap` plugin under `Plugins` dashboard menu.
3. Because the plugin URL structures are pretty, make sure your wordpress `Permalink` Settings is also set to a pretty-link option (wordpress default permalinks is ugly i.e `http://example.com/?p=N`)
4. Activate/Install other plugins you will need for your development (i.e `custom posts`, `advance custom fields`, `ACF to REST API`)
5. All done! You can now add content, use and customize plugins.


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
