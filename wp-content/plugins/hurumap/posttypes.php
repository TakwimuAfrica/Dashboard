<?php

function create_posttype()
{
    register_post_type(
        'snippet',
        array(
            'labels' => array(
                'name' => __('Snippets'),
                'singular_name' => __('Snippet')
            ),
            'public' => true,
            'has_archive' => true,
            'rewrite' => array('slug' => 'snippets'),
            'show_in_rest' => true,
            'supports' => array('title', 'editor', 'excerpt', 'thumbnail', 'custom-fields')
        )
    );
}
add_action('init', 'create_posttype');

function prefix_disable_gutenberg($current_status, $post_type)
{
    if ($post_type === 'snippet') {
        return false;
    }
    return $current_status;
}
add_filter('use_block_editor_for_post_type', 'prefix_disable_gutenberg', 10, 2);
