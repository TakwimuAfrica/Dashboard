<?php
add_action('admin_footer', 'admin_footer');
function admin_footer()
{
    $domain = strpos($_SERVER['HTTP_HOST'], 'localhost:8080') !== false ? 'localhost' : 'takwimu.africa';
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

    /**
     * PDF preview script
     */
    wp_enqueue_script("pdfJS", "https://mozilla.github.io/pdf.js/build/pdf.js");
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
