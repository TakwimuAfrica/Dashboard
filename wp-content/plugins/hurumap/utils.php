<?php

function topics_with_visual($visualId, $topics) {
    $res = array();
    foreach( $topics as $topic ) {
        $country = get_the_category($topic->ID)[0]->name;
        if (preg_match("/chartId\":\"$visualId\"/i", $topic->post_content)) {
            array_push($res, array('id' => $topic->ID, 'title' => $topic->post_title, 'country' => $country ));
        }
    }
    return $res;
}


function relate_topics_to_pages() {
    $posts = get_posts(array(
        'posts_per_page'			=> -1,
        'post_type'					=> 'hurumap-visual',
        'post_status'				=> array('publish')
        ));

    $topics = get_posts(array(
        'posts_per_page'			=> -1,
        'post_type'					=> 'topic_page',
        'post_status'				=> array('publish')
    ));

    foreach( $posts as $post ) {
        if (!$post || ($post->post_excerpt != 'hurumap' && $post->post_excerpt != 'flourish')) {
            continue;
        }

        $definition = json_decode($post->post_content, true);

        $definition['inTopics'] = topics_with_visual($post->ID, $topics);
        $post->post_content = json_encode($definition);

        wp_update_post($post);
    }
}