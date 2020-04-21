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

// //acf-to-rest-api uses get_field() function
// //This filter is applied to the $value after it is loaded from the db and before it is returned to the template via functions such as get_field().
add_filter( 'acf/format_value/type=relationship', 'acf_format_post_value', 20, 3 );
add_filter( 'acf/format_value/type=post_object', 'acf_format_post_value', 20, 3 );

function acf_format_post_value( $value, $post_id, $field ) {
    if ( $field['return_format'] !== 'object' ) {
        return $value;
    }

    if ( is_array( $value ) ) {
        foreach( $value as $post ) {
            $formatted[] = filter_by_lang( $post );
        }
    } else {
        $formatted = filter_by_lang( $value );
    }
    return $formatted;
};

function filter_by_lang( $post ) {
    return get_posts(['numberposts' => 1, 'post_type' => $post->post_type, 'post__in' => [$post->ID], 'suppress_filters' => 0])[0];
}

if( function_exists('acf_add_options_page') ) {
	
	acf_add_options_page(array(
        'page_title' 	=> 'Site Settings',
        'post_id'       => 'site-settings',
		'menu_title'	=> 'Site Settings',
		'menu_slug' 	=> 'site-settings',
        'capability'	=> 'edit_posts',
		'redirect'		=> false
    ));
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
