<?php

/**
 * Ensure the posttype page rule is always the page slug
 * By default it uses ID which causes problem e.g. when exporting
 */
add_filter('acf/location/rule_values/page', 'acf_location_rule_values_page', 10, 4);
function acf_location_rule_values_page($choices)
{
    $choices = array();
    $page_slugs = wp_list_pluck(get_pages(), 'post_name');
    if ($page_slugs) {
        foreach ($page_slugs as $page_slug) {
            $choices[$page_slug] = $page_slug;
        }
    }
    return $choices;
}

/**
 * Ensure page rule matches the slug
 */
add_filter('acf/location/rule_match/page', 'acf_location_rule_match_page', 10, 4);
function acf_location_rule_match_page($match, $rule, $options, $field_group)
{
    $page_slug = $rule['value'];

    global $post;
    $post_type = $post->post_type;
    $post_slug = $post->post_name;

    if ($post_type != 'page') {
        return false;
    }

    $match = false;

    if ($post_slug && $rule['operator'] == "==") {
        $match = ($post_slug == $page_slug);
    } else if ($post_slug && $rule['operator'] == "!=") {
        $match = ($post_slug != $page_slug);
    }

    return $match;
}

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
/**	
 * Preppend Category Name on topic pages and profile pages	
 * Topic and Section titles often repeat for geographies	
 * Assists in selection	
 */
function post_object_field_result($title, $post, $field, $post_id)
{
    //get category of the post	
    $category_name = get_the_category($post->ID)[0]->name ;

    // append post category country to each post result	
    $title = $category_name . ' : ' . $title;
    return $title;
}
add_filter('acf/fields/post_object/result', 'post_object_field_result', 10, 4);
add_filter('acf/fields/relationship/result', 'post_object_field_result', 10, 5);

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

add_filter('acf/update_value/key=field_5dee703609976', 'bidirectional_acf_update_value', 10, 6);
/**	
 * a custom acf block for indicators (image, documents, embed, raw-html, free-form)	
 * filter publish post	
 */
function register_acf_block_types()
{
    // register an indicator block.	
    acf_register_block_type(array(
        'name'              => 'Indicator',
        'title'             => __('Indicator'),
        'description'       => __('An indicator block.'),
        'render_template'   => get_template_directory() . '/template-parts/blocks/indicator.php',
        'enqueue_script'     => get_template_directory_uri() . '/template-parts/blocks/indicator.js',
        'category'          => 'widgets',
        'icon'              => 'admin-comments',
        'keywords'          => array('indicator'),
    ));
    //add more block here	
}
// Check if function exists and hook into setup.	
if (function_exists('acf_register_block_type')) {
    add_action('acf/init', 'register_acf_block_types');
}

/**
 * Local JSON
 * https://www.advancedcustomfields.com/resources/local-json/
 */

/**
 * NOTE: Only 1 save point!!
 * 
 * add_filter('acf/settings/save_json', 'my_acf_json_save_point');
 * function my_acf_json_save_point( $path ) {
 *   // update path
 *   $path = get_stylesheet_directory() . '/my-custom-folder';
 *   // return
 *   return $path;
 * }
 */

/**
 * During ACF’s initialization procedure, all .json files within the acf-json folder will be loaded.
 * NOTE: We can add multiple load points (folders).
 * 
 * add_filter('acf/settings/load_json', 'my_acf_json_load_point');
 * function my_acf_json_load_point( $paths ) {
 *   // remove original path (optional)
 *   // unset($paths[0]);
 *   // append path
 *   $paths[] = get_stylesheet_directory() . '/my-custom-folder';
 *   // return
 *   return $paths;
 * }
 */
