<?php

//rename elasticsearch/elastic press index name
function custom_index_name() {
    return 'takwimu';
}

add_filter( 'ep_index_name', 'custom_index_name');

//Exclude page post from being indexed
function exclude_page_posts($post_types) {
    //don't search page type
    unset( $post_types['page'] );
    return $post_types;
}

add_filter( 'ep_indexable_post_types', 'exclude_page_posts');
add_filter ('ep_searchable_post_types', 'exclude_page_posts');
