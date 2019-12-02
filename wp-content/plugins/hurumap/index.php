<?php

/**
 * Plugin Name: HURUmap
 * Plugin URI: https://github.com/Takwimu/Dashboard
 * Description: Hurumap WordPress plugin.
 * Author: CfA Tech <tech@codeforafrica.org>
 * Version: 0.1.0
 *
 * @package hurumap
 */

defined( 'ABSPATH' ) || exit;

require plugin_dir_path( __FILE__ ) . 'db.php';
require plugin_dir_path( __FILE__ ) . 'api.php';
require plugin_dir_path( __FILE__ ) . 'acf.php';
require plugin_dir_path( __FILE__ ) . 'posttypes.php';
 

register_activation_hook(__FILE__, 'activate_hurumap_data');
register_deactivation_hook(__FILE__, 'deactivate_hurumap_data');

function hurumap_data_root() {
    ?><div id="wp-hurumap-data" style="padding: 20px;"></div><?php;
}

function register_admin_scripts()
{
    $asset_file = include(plugin_dir_path(__FILE__) . 'build/data-page/index.asset.php');

    /**
     * Register all code split js files
     */
    $files = scandir(plugin_dir_path(__FILE__) . 'build/data-page');
    foreach($files as $file) {
        if (strpos($file, '.js') !== false) {
            wp_register_script(
                "hurumap-data-admin-script-$file",
                plugins_url("build/data-page/$file", __FILE__),
                $asset_file['dependencies'], 
                $asset_file['version']
            );
        }
    }
}

function load_admin_scripts()
{
    $screen = get_current_screen();
    if ($screen->id == 'toplevel_page_hurumap-data') {

        /**
         * Enqueue all code split js files
         */
        $files = scandir(plugin_dir_path(__FILE__) . 'build/data-page');
        foreach($files as $file) {
            if (strpos($file, '.js') !== false) {
                wp_enqueue_script("hurumap-data-admin-script-$file");
            }
        }
        global $wpdb;

        $hurumap = $wpdb->get_results("SELECT * FROM {$wpdb->base_prefix}hurumap_charts order by created_at desc");
        $flourish = $wpdb->get_results("SELECT * FROM {$wpdb->base_prefix}flourish_charts order by created_at desc");
        $sections = $wpdb->get_results("SELECT * FROM {$wpdb->base_prefix}chart_sections order by `order` desc");

        /**
         * Provide index js with initial data
         */
        wp_localize_script('hurumap-data-admin-script-index.js', 'initial', 
            array(
            'charts' => array('hurumap' => $hurumap, 'flourish' => $flourish, 'sections' => $sections),
        ));
    }
}

function setup_admin_menu() {
  add_menu_page('HURUmap Data', 'HURUmap Data', 'manage_options', 'hurumap-data', 'hurumap_data_root');
}

add_action('init', 'hurumap_data_blocks_register');

function hurumap_data_blocks_register()
{
    $asset_file = include(plugin_dir_path(__FILE__) . 'build/blocks/index.asset.php');

    wp_register_script(
        'hurumap-data-blocks-script',
        plugins_url('build/blocks/index.js', __FILE__),
        $asset_file['dependencies'],
        $asset_file['version']
    );

    //Register HURUmap block, flourish, and featured-data block
    register_block_type('hurumap-data/hurumap-block', array(
        'editor_script' => 'hurumap-data-blocks-script',
    ));

    register_block_type('hurumap-data/flourish-block', array(
        'editor_script' => 'hurumap-data-blocks-script',
    ));

    register_block_type('hurumap-data/featured-data', array(
        'editor_script' => 'hurumap-data-blocks-script',
    ));

    register_block_type('hurumap/card-block', array(
        'editor_script' => 'hurumap-data-blocks-script',
    ));
}

add_action('admin_enqueue_scripts', 'register_admin_scripts');
add_action('admin_enqueue_scripts', 'load_admin_scripts');
add_action('admin_menu', 'setup_admin_menu');