# Takwimu Dashboard

Wordpress-powered backend for Takwimu.AFRICA. Includes chart creation tools, snippets manager, Gutenberg blocks for WYSIWYG editorial interface, and elasticsearch integration. Main site accessible at https://takwimu.africa/

## Development
We use docker-based environment for development making use of [wordpress](https://hub.docker.com/_/wordpress/) and [mysql](https://hub.docker.com/_/mysql) docker images.

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

### WP Engine

To deploy make sure to add your wp engine git remotes for dev and production environments:

- git remote add `wpprod` git@git.wpengine.com:production/hurumap.git
- git remote add `wpdev` `< git@git.wpengine.com:staging/hurumap.git | git@git.wpengine.com:production/hurumapdev.git >`

We also add two redirects in the redirect rules

- Home; source is `^/$` and destination `wp-admin`
- Flourish; source is `flourish/(.+[^/])$` and destination `../$1/`

### Elasticsearch
Takwimu Dashboard uses elasticsearch to enhance wordpress search functionality along with the [elasticpress plugin](https://wordpress.org/plugins/elasticpress/).  For local development, we make use of the es server docker container. Once docker containers are up (i.e `docker-compose up`) you can visit `http:localhost:9200` 

1. Activate `ElasticPress` plugin on dashboard
2. Go to the plugin settings and add your elasticsearch host url i.e `http://es:9200` on `Third-Party/Self-Hosted` menu
3. Save changes and follow instruction to index your content.
4. Once content is sync, you're ready to use search. 


### WP MultiLang

In the multilang plugin, modifications were made to allow multilanguage json in post_content. This supports charts/visual definitions (i.e. `hurumap-visual` posttype) to have multilanguage language. The change is in `plugins/wpm-multilang/includes/wpm-translation-functions.php`:

```
	/**
	 * Karim:
	 *  Allow multilanguage json
	 * 
	 * original => if ( ! is_string( $string ) || $string === '' || is_serialized_string( $string ) || isJSON( $old_value ) )
	 */
	if ( ! is_string( $string ) || $string === '' || is_serialized_string( $string ) ) { 
```

and 

```
	/**
	 * Karim:
	 *  Allow multilanguage json
	 * 
	 * original => if ( is_serialized_string( $old_value ) || isJSON( $old_value ) ) 
	 */
	if ( is_serialized_string( $old_value ) ) {
```

Additionally, using `get_post` does not use the filters provided by `wp-multilang`. The filters allow getting the post in the language requested so instead we do:

```
get_posts(['numberposts' => 1, 'post_type' => $post->post_type, 'post__in' => [ < THE POST ID > ], 'suppress_filters' => 0])[0]
```

#### Deactivating & Uninstalling WP MultiLang
Deactivating the multilang plugin would result to your content being merged to one (i.e title becomes [:en]English title[:fr]French title[:sw]Swahili title). While deleting/unistalling will delete all languages except the site's default language (if you check the box `Delete translations when uninstalling plugin` on the plugin's general settings).

For local development you may see an error `Could not fully remove the plugin wp-multilang/wp-multilang.php` when deleting, this could be caused by the file & directory permission that limits PHP to write to the necessary folder/file. However, the uninstalling would have been completed. 


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


---

### License

Wordpress-powered backend for Takwimu.AFRICA.  
Copyright (C) 2019  africapractice, Code for Africa

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
