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

/**
 * Include the TGM_Plugin_Activation class.
 */
require_once get_template_directory() . '/class-tgm-plugin-activation.php';

add_action( 'tgmpa_register', 'hurumap_register_required_plugins' );

/**
 * Register the required plugins for this theme.
 */

function hurumap_register_required_plugins() {
	/*
	 * Array of plugin arrays. Required keys are name and slug.
	 * If the source is NOT from the .org repo, then source is also required.
	 */
	$plugins = array(
		//include a plugin bundled with a theme.
		array(
			'name'               => 'HURUmap', 
			'slug'               => 'hurumap',
			'source'             => get_template_directory() . '/lib/plugins/hurumap.zip', 
			'required'           => true,
			'version'            => '', // E.g. 1.0.0. If set, the active plugin must be this version or higher. If the plugin version is higher than the plugin version installed, the user will be notified to update the plugin.
			'force_activation'   => true,
			'force_deactivation' => true,
			'external_url'       => '', // If set, overrides default API URL and points to an external URL.
		),
        /* Once we deploy the plugin to WordPress Plugin Repository, then we can use this format
            array(
                'name'      => 'HURUmap',
                'slug'      => 'hurumap',
                'required'  => false,
            ),
        */
	);

	$config = array(
		'id'           => 'hurumap',                 // Unique ID for hashing notices for multiple instances of TGMPA.
		'default_path' => '',                      // Default absolute path to bundled plugins.
		'menu'         => 'tgmpa-install-plugins', // Menu slug.
		'has_notices'  => true,                    // Show admin notices or not.
		'dismissable'  => true,                    // If false, a user cannot dismiss the nag message.
		'dismiss_msg'  => '',                      // If 'dismissable' is false, this message will be output at top of nag.
		'is_automatic' => false,                   // Automatically activate plugins after installation or not.
		'message'      => '',                      // Message to output right before the plugins table.
	);

	tgmpa( $plugins, $config );
}
