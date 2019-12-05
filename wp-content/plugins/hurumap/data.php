<?php

add_filter('posts_where', 'posts_where', 10, 2 );

add_action('init', 'register_post_types', 5);
function register_post_types()
{
    $cap = acf_get_setting('capability');

    register_post_type('hurumap-visual', array(
        'labels'            => array(
            'name'                    => __('HURUmap Chart', 'hurumap-data'),
            'singular_name'            => __('HURUmap Chart', 'hurumap-data'),
            'add_new'                => __('Add New', 'hurumap-data'),
            'add_new_item'            => __('Add New HURUmap Chart', 'hurumap-data'),
            'edit_item'                => __('Edit HURUmap Chart', 'hurumap-data'),
            'new_item'                => __('New HURUmap Chart', 'hurumap-data'),
            'view_item'                => __('View HURUmap Chart', 'hurumap-data'),
            'search_items'            => __('Search HURUmap Charts', 'hurumap-data'),
            'not_found'                => __('No HURUmap Charts found', 'hurumap-data'),
            'not_found_in_trash'    => __('No HURUmap Charts found in Trash', 'hurumap-data'),
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

    register_post_type('flourish-visual', array(
        'labels'            => array(
            'name'                    => __('Flourish Visual', 'acf'),
            'singular_name'            => __('Flourish Visual', 'acf'),
            'add_new'                => __('Add New', 'acf'),
            'add_new_item'            => __('Add New Flourish Visual', 'acf'),
            'edit_item'                => __('Edit Flourish Visual', 'acf'),
            'new_item'                => __('New Flourish Visual', 'acf'),
            'view_item'                => __('View Flourish Visual', 'acf'),
            'search_items'            => __('Search Flourish Visuals', 'acf'),
            'not_found'                => __('No Flourish Visuals found', 'acf'),
            'not_found_in_trash'    => __('No Flourish Visuals found in Trash', 'acf'),
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

    // register_post_type('acf-field', array(
    //     'labels'            => array(
    //         'name'                    => __('Fields', 'acf'),
    //         'singular_name'            => __('Field', 'acf'),
    //         'add_new'                => __('Add New', 'acf'),
    //         'add_new_item'            => __('Add New Field', 'acf'),
    //         'edit_item'                => __('Edit Field', 'acf'),
    //         'new_item'                => __('New Field', 'acf'),
    //         'view_item'                => __('View Field', 'acf'),
    //         'search_items'            => __('Search Fields', 'acf'),
    //         'not_found'                => __('No Fields found', 'acf'),
    //         'not_found_in_trash'    => __('No Fields found in Trash', 'acf'),
    //     ),
    //     'public'            => false,
    //     'hierarchical'        => true,
    //     'show_ui'            => false,
    //     'show_in_menu'        => false,
    //     '_builtin'            => false,
    //     'capability_type'    => 'post',
    //     'capabilities'        => array(
    //         'edit_post'            => $cap,
    //         'delete_post'        => $cap,
    //         'edit_posts'        => $cap,
    //         'delete_posts'        => $cap,
    //     ),
    //     'supports'             => array('title'),
    //     'rewrite'            => false,
    //     'query_var'            => false,
    // ));
}
