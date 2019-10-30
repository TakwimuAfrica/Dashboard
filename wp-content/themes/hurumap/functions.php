<?php
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
add_action('enqueue_block_editor_assets', 'hurumap_block_editor_styles');
function hurumap_block_editor_styles()
{
    // Block styles.
    wp_enqueue_style('hurumap-block-editor-style', get_theme_file_uri('/assets/css/editor-blocks.css'), array(), '1.1');
    wp_enqueue_script('remove-default-styles-wrapper-script', get_theme_file_uri('/assets/js/remove-default-styles-wrapper.js'));

    /**
     * Blocks pdf preview script
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
 * Preppend Geography Name on topic pages and profile pages	
 * Topic and Section titles often repeat for geographies	
 * Assists in selection	
 */
function post_object_field_result($title, $post, $field, $post_id)
{
    $geography_list = (object) [
        'burkina-faso' => 'Burkina Faso',
        'democratic-republic-congo' => 'DR Congo',
        'ethiopia' => 'Ethiopia',
        'kenya' => 'Kenya',
        'nigeria' => 'Nigeria',
        'senegal' => 'Sengal',
        'south-africa' => 'South Africa',
        'tanzania' => 'Tanzania',
        'uganda' => 'Uganda',
        'zambia' => 'Zambia'
    ];
    //get geography of the post	
    $geography_slug = get_field('geography', $post->ID);
    $geography = $geography_list->$geography_slug;
    // append post geography to each post result	
    $title = $geography . ' : ' . $title;
    return $title;
}
add_filter('acf/fields/post_object/result', 'post_object_field_result', 10, 4);
/*	
 * Add geography column label to posts list	
 */
function add_geography_column_label($columns)
{
    //add geography label to existing column array	
    $columns['geography'] = __('Geography');
    return $columns;
}
add_filter('manage_posts_columns', 'add_geography_column_label');
/*	
 * Add geography column values to posts list	
 */
function geography_custom_column($column, $post_id)
{
    $geography_list = (object) [
        'burkina-faso' => 'Burkina Faso',
        'democratic-republic-congo' => 'DR Congo',
        'ethiopia' => 'Ethiopia',
        'kenya' => 'Kenya',
        'nigeria' => 'Nigeria',
        'senegal' => 'Sengal',
        'south-africa' => 'South Africa',
        'tanzania' => 'Tanzania',
        'uganda' => 'Uganda',
        'zambia' => 'Zambia'
    ];
    switch ($column) {
        case 'geography':
            //get geography of the post	
            $geography_slug = get_field('geography', $post->ID);
            $geography = $geography_list->$geography_slug;
            if ($geography) {
                echo $geography;
            } else {
                echo '';
            }
            break;
    }
}
add_action('manage_posts_custom_column', 'geography_custom_column', 10, 2);
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
