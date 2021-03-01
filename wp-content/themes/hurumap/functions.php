<?php
add_action('admin_footer', 'admin_footer');
function admin_footer()
{
    $allowed_hosts = array(
        // Local ENV
        'localhost:8080' => 'localhost', // to allow front-end running on diffent port
        // Dev ENV
        'codeforafrica.vercel.app' => 'codeforafrica.vercel.app',
        'outbreak-africa.vercel.app' => 'outbreak-africa.vercel.app',
        'dev.outbreak.africa' => 'outbreak.africa',
        // Prod ENV
        'covid19.outbreak.africa' => 'outbreak.africa',
        'outbreak.africa' => 'outbreak.africa'
    );
    $domain = 'hurumap.org';
    foreach($allowed_hosts as $domain_from => $domain_to) {
        if (substr($_SERVER['HTTP_HOST'], -strlen($domain_from)) === $domain_from) {
            $domain = $domain_to;
            break;
        }
    }
    echo '"<script type="text/javascript">try { document.domain = "' . $domain . '"; } catch (e) { console.error(e); } </script>"';
}
add_action('after_setup_theme', 'hurumap_setup');
function hurumap_setup()
{
    /*
	 * This theme styles the visual editor to resemble the theme style,
	 * specifically font, colors, and column width.
	  */
    add_editor_style(array('assets/css/editor-style.css'));

    // Load regular editor styles into the new block-based editor.
    add_theme_support('editor-styles');

    // Load default block styles.
    add_theme_support('wp-block-styles');

    //featured images
    add_theme_support( 'post-thumbnails' );
}
add_filter( 'template_include', 'add_response_template' );
function add_response_template($template) {
    global $wp_query;
    /**
     * Don't send 404 if link is /embed
     */
    function starts_with($string, $startString) { 
        $len = strlen($startString); 
        return (substr($string, 0, $len) === $startString); 
    } 
    if (starts_with($_SERVER['REQUEST_URI'], '/embed')) {
        status_header( 200 );
        $wp_query->is_404=false;
    }
    return $template;
  }

add_action('enqueue_block_editor_assets', 'hurumap_block_editor_styles');
function hurumap_block_editor_styles()
{
    // Block styles.
    wp_enqueue_style('hurumap-block-editor-style', get_theme_file_uri('/assets/css/editor-blocks.css'), array(), '1.1');
    wp_enqueue_script('remove-default-styles-wrapper-script', get_theme_file_uri('/assets/js/remove-default-styles-wrapper.js'));

}
add_action('wp_enqueue_scripts', 'hurumap_load_scripts');
function hurumap_load_scripts()
{
    wp_enqueue_style('hurumap-style', get_stylesheet_uri());
    wp_enqueue_script('jquery');
}

/**	
 * Remove the content editor, discussion, comments, and author fields for Index, Contact, and Legal pages 	
 * If we change theme, this functions has to move to new theme's editor (function.php)	
 */
function remove_unused_fields()
{
    $post_id = $_GET['post'] ? $_GET['post'] : $_POST['post_ID'];
    if (!isset($post_id)) return;
    if ($post_id == 81 || $post_id == 71 || $post_id == 39) {
        remove_post_type_support('page', 'editor');
        remove_post_type_support('page', 'discussion');
        remove_post_type_support('page', 'comments');
        remove_post_type_support('page', 'author');
    }
}
add_action('init', 'remove_unused_fields');
/**	
 * customizing post object query	
 * filter publish post	
 */
function post_object_field_query($args, $field, $post_id)
{
    // only show post which are published	
    $args['post_status']  = array('publish'); // Hide drafts	
    $args['order'] = 'ASC';
    // return	
    return $args;
}
// filter for every field	
add_filter('acf/fields/post_object/query', 'post_object_field_query', 10, 3);


/*	
 * Add bidirectional link between profile section and topic	
 */
function bidirectional_acf_update_value( $value, $post_id, $field  ) {
	// vars
	$field_name = $field['name'];
	$field_key = $field['key'];
	$global_name = 'is_updating_' . $field_name;
	
	// bail early if this filter was triggered from the update_field() function called within the loop below
	// - this prevents an inifinte loop
	if( !empty($GLOBALS[ $global_name ]) ) return $value;
	
	// set global variable to avoid inifite loop
	// - could also remove_filter() then add_filter() again, but this is simpler
	$GLOBALS[ $global_name ] = 1;
	
	// loop over selected posts and add this $post_id
	if( is_array($value) ) {

		foreach( $value as $post_id2 ) {
			// load existing related posts
			$value2 = get_field($field_name, $post_id2, false);
			// allow for selected posts to not contain a value
			if( empty($value2) ) {
				$value2 = array();
			}
			// bail early if the current $post_id is already found in selected post's $value2
			if( in_array($post_id, $value2) ) continue;
			
			// append the current $post_id to the selected post's 'related_posts' value
			$value2[] = $post_id;
			
			// update the selected post's value (use field's key for performance)
			update_field($field_key, $value2, $post_id2);
		}
	}
	// find posts which have been removed
	$old_value = get_field($field_name, $post_id, false);
	
	if( is_array($old_value) ) {
		
		foreach( $old_value as $post_id2 ) {
			
			// bail early if this value has not been removed
			if( is_array($value) && in_array($post_id2, $value) ) continue;
			
			$value2 = get_field($field_name, $post_id2, false); // load existing related posts
			
			if( empty($value2) ) continue; // bail early if no value
			
		
			// find the position of $post_id within $value2 so we can remove it
			$pos = array_search($post_id, $value2);
			
			// remove
			unset( $value2[ $pos] );
			
			// update the un-selected post's value (use field's key for performance)
			update_field($field_key, $value2, $post_id2);
		}
	}
	
	// reset global varibale to allow this filter to function as per normal
	$GLOBALS[ $global_name ] = 0;
    return $value;
}

add_filter('acf/update_value/key=field_5ec4e570a7abb', 'bidirectional_acf_update_value', 10, 6);

add_filter( 'acf/rest_api/page/get_fields', function( $data, $request ) {
    if ( isset( $data['acf']['posts'] ) ) {
        $_posts = $data['acf']['posts'];
        if (is_array($_posts)) {
            foreach( $_posts as $_post ) {
               $thumbnail_url = get_field("thumbnail_image", $_post->ID, false);
               if (empty($thumbnail_url)) {
                   $image_url =  get_the_post_thumbnail_url($_post->ID);
                   $_post->featured_image = $image_url;
                } else {
                    $_post->featured_image = $thumbnail_url;
                }
               $_post->categories = get_the_category($_post->ID);
               $_post->published_date = get_field("date", $_post->ID, false);
            }
        } else {
            $thumbnail_url = get_field("thumbnail_image", $_posts->ID, false);
            if (empty($thumbnail_url)) {
                $image_url = get_the_post_thumbnail_url($_posts->ID);
                $_posts->featured_image = $image_url;
            } else {
                $_posts->featured_image = $thumbnail_url;
            }
            $_posts->categories = get_the_category($_posts->ID);
            $_posts->published_date = get_field("date", $_posts->ID, false);
        }
    }

    return $data;
}, 10, 3 );

//rename elasticsearch/elastic press index name
function custom_index_name() {
    return 'outbreak';
}

add_filter( 'ep_index_name', 'custom_index_name');


//Add revision to acf post types
add_filter('rest_prepare_revision', function ($response, $post) {
    $data = $response->get_data();
    $data['acf'] = get_fields($post->ID);
    return rest_ensure_response($data);
    }, 10, 2);


//Add custome preview page url link
 function custom_preview_page_link($link) {
	$id = get_the_ID();
	$nonce = wp_create_nonce( 'wp_rest' );
    //$post = get_post( $id );
	//$slug = $post->post_name;
	$link = 'http://localhost/wp-json/acf/pages/'. $id. '/revisions/?_wpnonce='. $nonce;
    //$link = 'http://localhost/promisetracker/wp-json/acf/v3/' . '/?preview_id='. $id. '&preview_nonce=' . $nonce . '&preview=true';
	return $link;
}
add_filter('preview_post_link', 'custom_preview_page_link');  

//add custom preview post
