<?php

if (!defined('ABSPATH')) exit; // Exit if accessed directly

if (!class_exists('HURUmapData')) :

    class HURUmapData
    {

        function initialize()
        {
            add_action('init', array($this, 'register_post_types'));

            // Add filters.
            // add_filter('posts_where', array($this, 'posts_where'));
        }

        function register_post_types()
        {
            $cap = acf_get_setting('capability');

            register_post_type('hurumap-visual', array(
                'labels'            => array(
                    'name'                    => __('Visual', 'hurumap-data'),
                    'singular_name'            => __('Visual', 'hurumap-data'),
                    'add_new'                => __('Add New', 'hurumap-data'),
                    'add_new_item'            => __('Add New Visual', 'hurumap-data'),
                    'edit_item'                => __('Edit Visual', 'hurumap-data'),
                    'new_item'                => __('New Visual', 'hurumap-data'),
                    'view_item'                => __('View Visual', 'hurumap-data'),
                    'search_items'            => __('Search Visuals', 'hurumap-data'),
                    'not_found'                => __('No Visuals found', 'hurumap-data'),
                    'not_found_in_trash'    => __('No Visuals found in Trash', 'hurumap-data'),
                ),
                'public'            => true,
                'hierarchical'        => true,
                'show_ui'            => true,
                'show_in_menu'        => false,
                '_builtin'            => false,
                'capability_type'    => 'post',
                'capabilities'        => array(
                    'edit_post'            => $cap,
                    'delete_post'        => $cap,
                    'edit_posts'        => $cap,
                    'delete_posts'        => $cap,
                ),
                'supports'             => array('title'),
                'rewrite'            => false,
                'query_var'            => false,
            ));

            register_post_type('hurumap-section', array(
                'labels'            => array(
                    'name'                    => __('Visuals Section', 'acf'),
                    'singular_name'            => __('Visuals Section', 'acf'),
                    'add_new'                => __('Add New', 'acf'),
                    'add_new_item'            => __('Add New Visuals Section', 'acf'),
                    'edit_item'                => __('Edit Visuals Section', 'acf'),
                    'new_item'                => __('New VisualsSection', 'acf'),
                    'view_item'                => __('View Visuals Section', 'acf'),
                    'search_items'            => __('Search Visual Sections', 'acf'),
                    'not_found'                => __('No Visual Sections found', 'acf'),
                    'not_found_in_trash'    => __('No Visual Sections found in Trash', 'acf'),
                ),
                'public'            => false,
                'hierarchical'        => true,
                'show_ui'            => true,
                'show_in_menu'        => false,
                '_builtin'            => false,
                'capability_type'    => 'post',
                'capabilities'        => array(
                    'edit_post'            => $cap,
                    'delete_post'        => $cap,
                    'edit_posts'        => $cap,
                    'delete_posts'        => $cap,
                ),
                'supports'             => array('title'),
                'rewrite'            => false,
                'query_var'            => false,
            ));
        }

    }

    function hurumap_data() {
        global $hurumap_data;

        if (!isset($hurumap_data)) {
            $hurumap_data = new HURUmapData;
            $hurumap_data->initialize();
        }
        return $hurumap_data;
    }

    hurumap_data();

endif;
