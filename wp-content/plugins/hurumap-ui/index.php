<?php

/**
 * Plugin Name: HURUmap UI Blocks
 * Plugin URI: https://github.com/CodeForAfrica/HURUmap-UI-WP
 * Description: Dummy block for HURUmap UI WordPress plugin.
 * Author: CfA Tech <tech@codeforafrica.org>
 * Version: 0.1.0
 *
 * @package hurumap-ui
 */

defined( 'ABSPATH' ) || exit;

/**
 * Load all translations for our plugin from the MO file.
*/
function hurumap_ui_blocks_load_textdomain() {
	load_plugin_textdomain( 'hurumap-ui', false, basename( __DIR__ ) . '/languages' );
}
add_action( 'init', 'hurumap_ui_blocks_load_textdomain' );

/**
 * Registers all block assets so that they can be enqueued through Gutenberg in
 * the corresponding context.
 *
 * Passes translations to JavaScript.
 */
function hurumap_ui_blocks_register()
{
    $asset_file = include(plugin_dir_path(__FILE__) . 'build/index.asset.php');

    wp_register_script(
        'hurumap-ui-blocks-script',
        plugins_url('build/index.js', __FILE__),
        $asset_file['dependencies'],
        $asset_file['version']
    );

    register_block_type('hurumap-ui/blocks', array(
        'editor_script' => 'hurumap-ui-blocks-script',
    ));
}

add_action('init', 'hurumap_ui_blocks_register');
