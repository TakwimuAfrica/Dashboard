<?php

function create_posttype()
{
    /**
	 * Post Type: Profile Sections.
	 */

	$labels = array(
		"name" => __( "Profile Sections", "hurumap" ),
		"singular_name" => __( "Profile Section", "hurumap" ),
		"parent_item_colon" => __( "Parent Profile", "hurumap" ),
		"parent_item_colon" => __( "Parent Profile", "hurumap" ),
	);

	$args = array(
		"label" => __( "Profile Sections", "hurumap" ),
		"labels" => $labels,
		"description" => "",
		"public" => true,
		"publicly_queryable" => true,
		"show_ui" => true,
		"delete_with_user" => false,
		"show_in_rest" => true,
		"rest_base" => "",
		"rest_controller_class" => "WP_REST_Posts_Controller",
		"has_archive" => false,
		"show_in_menu" => true,
		"show_in_nav_menus" => true,
		"exclude_from_search" => false,
		"capability_type" => "post",
		"map_meta_cap" => true,
		"hierarchical" => false,
		"rewrite" => array( "slug" => "profile_section_page", "with_front" => false ),
		"query_var" => true,
		"supports" => array( "title", "editor" ),
		"taxonomies" => array( "category"),
	);

	register_post_type( "profile_section_page", $args );

	/**
	 * Post Type: Topics.
	 */

	$labels = array(
		"name" => __( "Topics", "hurumap" ),
		"singular_name" => __( "Topic", "hurumap" ),
	);

	$args = array(
		"label" => __( "Topics", "hurumap" ),
		"labels" => $labels,
		"description" => "",
		"public" => true,
		"publicly_queryable" => true,
		"show_ui" => true,
		"delete_with_user" => false,
		"show_in_rest" => true,
		"rest_base" => "",
		"rest_controller_class" => "WP_REST_Posts_Controller",
		"has_archive" => false,
		"show_in_menu" => true,
		"show_in_nav_menus" => true,
		"exclude_from_search" => false,
		"capability_type" => "post",
		"map_meta_cap" => true,
		"hierarchical" => false,
		"rewrite" => array( "slug" => "topic_page", "with_front" => true ),
		"query_var" => true,
		"supports" => array( "title", "editor" ),
		"taxonomies" => array( "category"),
	);

	register_post_type( "topic_page", $args );

	/**
	 * Post Type: Carousel Topics.
	 */

	$labels = array(
		"name" => __( "Carousel Topics", "hurumap" ),
		"singular_name" => __( "Carousel Topic", "hurumap" ),
	);

	$args = array(
		"label" => __( "Carousel Topics", "hurumap" ),
		"labels" => $labels,
		"description" => "",
		"public" => true,
		"publicly_queryable" => true,
		"show_ui" => true,
		"delete_with_user" => false,
		"show_in_rest" => true,
		"rest_base" => "",
		"rest_controller_class" => "WP_REST_Posts_Controller",
		"has_archive" => false,
		"show_in_menu" => true,
		"show_in_nav_menus" => true,
		"exclude_from_search" => false,
		"capability_type" => "post",
		"map_meta_cap" => true,
		"hierarchical" => false,
		"rewrite" => array( "slug" => "carousel_topic", "with_front" => true ),
		"query_var" => true,
		"supports" => array( "title" ),
		"taxonomies" => array( "category"),
	);

	register_post_type( "carousel_topic", $args );

	/**
	 * Post Type: Profiles.
	 */

	$labels = array(
		"name" => __( "Profiles", "hurumap" ),
		"singular_name" => __( "Profile", "hurumap" ),
	);

	$args = array(
		"label" => __( "Profiles", "hurumap" ),
		"labels" => $labels,
		"description" => "",
		"public" => true,
		"publicly_queryable" => true,
		"show_ui" => true,
		"delete_with_user" => false,
		"show_in_rest" => true,
		"rest_base" => "",
		"rest_controller_class" => "WP_REST_Posts_Controller",
		"has_archive" => false,
		"show_in_menu" => true,
		"show_in_nav_menus" => true,
		"exclude_from_search" => false,
		"capability_type" => "post",
		"map_meta_cap" => true,
		"hierarchical" => false,
		"rewrite" => array( "slug" => "profile", "with_front" => true ),
		"query_var" => true,
		"supports" => array( "title" ),
		"taxonomies" => array( "category"),
	);

    register_post_type( "profile", $args );
    
    /**
     * Post Type: Snippet
     */

    register_post_type(
        'snippet',
        array(
            'labels' => array(
                'name' => __('Snippets'),
                'singular_name' => __('Snippet')
			),
			"show_ui" => true,
			'public' => false,
			'exclude_from_search' => true,
			'has_archive' => true,
            'rewrite' => array('slug' => 'snippets'),
            'show_in_rest' => true,
            'supports' => array('title', 'editor', 'excerpt', 'thumbnail', 'custom-fields')
        )
    );
}
//add_action('init', 'create_posttype');

function prefix_disable_gutenberg($current_status, $post_type)
{
    if ($post_type === 'snippet') {
        return false;
    }
    return $current_status;
}
//add_filter('use_block_editor_for_post_type', 'prefix_disable_gutenberg', 10, 2);
