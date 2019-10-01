<?php

/**
 * Plugin Name: HURUmap Data
 * Plugin URI: https://github.com/CodeForAfrica/HURUmap-Data-WP
 * Description: Dummy block for HURUmap UI WordPress plugin.
 * Author: CfA Tech <tech@codeforafrica.org>
 * Version: 0.1.0
 *
 * @package hurumap-data
 */

defined( 'ABSPATH' ) || exit;

require plugin_dir_path( __FILE__ ) . 'db.php';
require plugin_dir_path( __FILE__ ) . 'api.php';
 

register_activation_hook(__FILE__, 'activate_hurumap_data');
register_deactivation_hook(__FILE__, 'deactivate_hurumap_data');

function hurumap_data_root() {
    ?><div id="wp-hurumap-data"></div><?php;
}

function register_admin_scripts()
{
    $asset_file = include(plugin_dir_path(__FILE__) . 'build/index.asset.php');
    wp_register_script(
        'hurumap-data-admin-script',
        plugins_url('build/index.js', __FILE__),
        $asset_file['dependencies'], 
        $asset_file['version']
    );
}

function load_admin_scripts()
{
    $screen = get_current_screen();
    if ($screen->id == 'toplevel_page_hurumap-data') {
        wp_enqueue_script( 'hurumap-data-admin-script' );
    }
}

function setup_admin_menu() {
  add_menu_page('Hurumap Data', 'Hurumap Data', 'manage_options', 'hurumap-data', 'hurumap_data_root');
}

add_action('admin_enqueue_scripts', 'register_admin_scripts');
add_action('admin_enqueue_scripts', 'load_admin_scripts');
add_action('admin_menu', 'setup_admin_menu');