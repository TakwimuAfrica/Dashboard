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

if( ! class_exists('HURUmap') ) :

class HURUmap {

    function initialize() {

        require plugin_dir_path( __FILE__ ) . 'class-tgm-plugin-activation.php';
        require plugin_dir_path( __FILE__ ) . 'utils.php';
        require plugin_dir_path( __FILE__ ) . 'api.php';
        require plugin_dir_path( __FILE__ ) . 'data.php';
        require plugin_dir_path( __FILE__ ) . 'helpers.php';
        require plugin_dir_path( __FILE__ ) . 'posttypes.php';
        require plugin_dir_path( __FILE__ ) . 'acf.php';
        require plugin_dir_path( __FILE__ ) . 'elasticpress.php';
        
        add_action( 'tgmpa_register', array($this, 'hurumap_register_required_plugins'));
        add_action('init', array($this, 'hurumap_data_blocks_register'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('admin_menu', array($this, 'setup_admin_menu'));
    }
    
    function setup_admin_menu() {
        // add_menu_page('HURUmap Data', 'HURUmap Data', 'manage_options', 'hurumap-data', array($this, 'hurumap_data_root'));
        // Vars.
        $slug = 'edit.php?post_type=hurumap-visual';
        $cap = 'manage_options';  // Capability needed to view plugin install page, should be a capability associated with the parent menu used        
        
        // Add menu items.
        add_menu_page( __("HURUmap",'hurumap-data'), __("HURUmap",'hurumap-data'), $cap, $slug, false, 'dashicons-welcome-widgets-menus');
        add_submenu_page( $slug, __('Visuals','hurumap-data'), __('Visuals','hurumap-data'), $cap, $slug );
        add_submenu_page( $slug, __('Sections','hurumap-data'), __('Sections','hurumap-data'), $cap, 'edit.php?post_type=hurumap-section' );
        add_submenu_page( $slug, __('New Visual','hurumap-data'), __('New Visual','hurumap-data'), $cap, 'post-new.php?post_type=hurumap-visual');
        add_submenu_page( $slug, __('New Section','hurumap-data'), __('New Section','hurumap-data'), $cap, 'post-new.php?post_type=hurumap-section' );

        // 
        add_action( 'admin_head', array($this, 'add_custom_sync_topics_button') );
        // Add the custom columns to the book post type:
        add_filter( 'manage_hurumap-visual_posts_columns', array($this, 'set_custom_hurumap_visual_columns') );
        // Add the data to the custom columns for the book post type:
        add_action( 'manage_hurumap-visual_posts_custom_column' , array($this, 'hurumap_visual_column'), 10, 2 );


        add_action( 'save_post_hurumap-section',  array($this, 'save_post_hurumap_section'), 10, 3 );
        add_action( 'save_post_topic_page',  array($this, 'save_post_topic_page'), 10, 3 );
    }

    function enqueue_scripts()
    {
        if (is_screen('hurumap-visual')) {
            // no autosave
            wp_dequeue_script('autosave');
        
            $asset_file = include(plugin_dir_path(__FILE__) . 'build/definitions/index.asset.php');

            /**
             * Register all code split js files
             */
            $files = scandir(plugin_dir_path(__FILE__) . 'build/definitions');
            foreach($files as $file) {
                if (strpos($file, '.js') !== false) {
                    wp_register_script(
                        "hurumap-definitions-admin-script-$file",
                        plugins_url("build/definitions/$file", __FILE__),
                        $asset_file['dependencies'], 
                        $asset_file['version']
                    );
                }
            }

            /**
             * Enqueue all code split js files
             */
            $files = scandir(plugin_dir_path(__FILE__) . 'build/definitions');
            foreach($files as $file) {
                if (strpos($file, '.js') !== false) {
                    wp_enqueue_script("hurumap-definitions-admin-script-$file");
                }
            }


            $results = get_posts([
                'post_type' => 'hurumap-section',
                'numberposts' => -1
              ]);
            $sections = array();
            foreach ($results as $result) {
                array_push($sections, json_decode($result->post_content));
            }

            /**
             * Provide index js with initial data
             */
            $post = get_post();
            wp_localize_script('hurumap-definitions-admin-script-index.js', 'initial', 
                array(
                'chart' => json_decode($post->post_content),
                'visualType' => $post->post_excerpt,
                'sections' => $sections
            ));
        } else if (is_screen('hurumap-section')) {
            // no autosave
            wp_dequeue_script('autosave');

            $asset_file = include(plugin_dir_path(__FILE__) . 'build/section/index.asset.php');

            /**
             * Register all code split js files
             */
            $files = scandir(plugin_dir_path(__FILE__) . 'build/section');
            foreach($files as $file) {
                if (strpos($file, '.js') !== false) {
                    wp_register_script(
                        "hurumap-section-admin-script-$file",
                        plugins_url("build/section/$file", __FILE__),
                        $asset_file['dependencies'], 
                        $asset_file['version']
                    );
                }
            }
            /**
             * Enqueue all code split js files
             */
            $files = scandir(plugin_dir_path(__FILE__) . 'build/section');
            foreach($files as $file) {
                if (strpos($file, '.js') !== false) {
                    wp_enqueue_script("hurumap-section-admin-script-$file");
                }
            }

            $results = get_posts([
                'post_type' => 'hurumap-visual',
                'numberposts' => -1
              ]);
            $charts = array();
            foreach ($results as $result) {
                array_push($charts, json_decode($result->post_content));
            }
            $results = get_posts([
                'post_type' => 'hurumap-section',
                'numberposts' => -1
              ]);
            $sections = array();
            foreach ($results as $result) {
                array_push($sections, json_decode($result->post_content));
            }

            $section = get_post();

            // Provide index js with initial data
            wp_localize_script('hurumap-section-admin-script-index.js', 'initial', 
                array(
                'section' => json_decode($section->post_content),
                'charts' => $charts,
                'sections' => $sections
            ));
        }
    }

    public function add_custom_sync_topics_button()
    {
        global $current_screen;
        if ('topic_page' == $current_screen->post_type || 'hurumap-visual' == $current_screen->post_type) {
            ?>
                <script type="text/javascript">
                    jQuery(document).ready(function($) {
                        jQuery(jQuery(".page-title-action")[0])
                            .after("<a id='doc_popup' class='add-new-h2' onclick='relateTopicsToCharts()'>Sync Topics To Visuals</a>");
                        window.relateTopicsToCharts = () => {
                            $.ajax({
                                url: '/wp-json/hurumap-data/charts/sync',
                                type: 'PUT',
                                success: (html) => {
                                    location.reload();
                                },
                                error: (html) => {
                                    alert('Failed to sync');
                                }
                            });
                        };
                    });
                </script>
            <?php
        }
    }

    function save_post_topic_page() {
        relate_topics_to_pages();
    }

    function save_post_hurumap_section( $post_ID ) {
        $remove_charts = json_decode(stripslashes($_POST['remove_charts']));
        $add_charts = json_decode(stripslashes($_POST['add_charts']));
        foreach($remove_charts as $id) {
            $chart = get_post($id);
            $chart_definition = json_decode($chart->post_content);
            $chart_definition->section = null;
            $chart->post_content = json_encode($chart_definition);
            wp_update_post($chart);
        }
        foreach($add_charts as $id) {
            $chart = get_post($id);
            $chart_definition = json_decode($chart->post_content);
            $chart_definition->section = $post_ID;
            $chart->post_content = json_encode($chart_definition);
            wp_update_post($chart);
        }
    }

    function set_custom_hurumap_visual_columns($columns) {
        return array(
            'cb' => $columns['cb'], 
            'title' => $columns['title'], 
            'visual_type' => __( 'Visual Type', 'hurumap-data' ), 
            'in_topics' => __( 'Visual Used In Topics', 'hurumap-data' ), 
            'date' => $columns['date']
        );
    }

    function hurumap_visual_column( $column, $post_id ) {
        switch ( $column ) {
            case 'visual_type' :
                $post = get_post($post_id);
                echo $post->post_excerpt;
                break;
            case 'in_topics' : {
                $post = get_post($post_id);
                $definition = json_decode($post->post_content, true);
                if (is_array($definition['inTopics'])) {
                    $in_topics = $definition['inTopics'];
                    ?>
                    <ul>
                    <?php
                    foreach($in_topics as $in_topic ) {
                        ?>
                         <li><?php echo $in_topic['title']; ?></li>
                        <?php
                    }
                    ?>
                    </ul>
                    <?php
                }
                break;
            }
            default:
                break;

        }
    }

    function hurumap_data_blocks_register() {
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
     
    function hurumap_register_required_plugins() {
        /*
        * Array of plugin arrays. Required keys are name and slug.
        * If the source is NOT from the .org repo, then source is also required.
        */
        $plugins = array(

            array(
                'name'      => 'Advanced Custom Fields',
                'slug'      => 'advanced-custom-fields',
                'required'  => true,
            ),
            array(
                'name'      => 'Advanced Custom Fields PRO',
                'slug'      => 'advanced-custom-fields-pro',
                'source'    => plugin_dir_path( __FILE__ ) . 'lib/plugins/advanced-custom-fields-pro.zip', // The plugin source.
                'required'  => true,
                'force_activation'   => false, // If true, plugin is activated upon theme activation and cannot be deactivated until theme switch.
			    'force_deactivation' => false, // If true, plugin is deactivated upon theme switch, useful for theme-specific plugins.
            ),
            array(
                'name'      => 'ACF to REST API',
                'slug'      => 'acf-to-rest-api',
                'required'  => true,
            ),
            array(
                'name'      => 'ElasticPress',
                'slug'      => 'elasticpress',
                'required'  => true,
            ),

        );

        /*
        * Array of configuration settings. Amend each line as needed.
        *
        * TGMPA will start providing localized text strings soon. If you already have translations of our standard
        * strings available, please help us make TGMPA even better by giving us access to these translations or by
        * sending in a pull-request with .po file(s) with the translations.
        *
        * Only uncomment the strings in the config array if you want to customize the strings.
        */
        $config = array(
            'id'           => 'hurumap',                 // Unique ID for hashing notices for multiple instances of TGMPA.
            'default_path' => '',                      // Default absolute path to bundled plugins.
            'menu'         => 'tgmpa-install-plugins', // Menu slug.
            'parent_slug'  => 'plugins.php',            // Parent menu slug.
            'capability'   => 'manage_options',    // Capability needed to view plugin install page, should be a capability associated with the parent menu used.
            'has_notices'  => true,                    // Show admin notices or not.
            'dismissable'  => true,                    // If false, a user cannot dismiss the nag message.
            'dismiss_msg'  => '',                      // If 'dismissable' is false, this message will be output at top of nag.
            'is_automatic' => true,                   // Automatically activate plugins after installation or not.
            'message'      => '',                      // Message to output right before the plugins table.

            'strings'      => array(
                'page_title'                      => __( 'Install Required Plugins', 'hurumap' ),
                'menu_title'                      => __( 'Install Plugins', 'hurumap' ),
                /* translators: %s: plugin name. */
                'installing'                      => __( 'Installing Plugin: %s', 'hurumap' ),
                /* translators: %s: plugin name. */
                'updating'                        => __( 'Updating Plugin: %s', 'hurumap' ),
                'oops'                            => __( 'Something went wrong with the plugin API.', 'hurumap' ),
                'notice_can_install_required'     => _n_noop(
                    /* translators: 1: plugin name(s). */
                    'HURUmap plugin requires the following plugin: %1$s.',
                    'HURUmap plugin requires the following plugins: %1$s.',
                    'hurumap'
                ),
                'notice_can_install_recommended'  => _n_noop(
                    /* translators: 1: plugin name(s). */
                    'HURUmap plugin recommends the following plugin: %1$s.',
                    'HURUmap plugin recommends the following plugins: %1$s.',
                    'hurumap'
                ),
                'notice_ask_to_update'            => _n_noop(
                    /* translators: 1: plugin name(s). */
                    'The following plugin needs to be updated to its latest version to ensure maximum compatibility with this theme: %1$s.',
                    'The following plugins need to be updated to their latest version to ensure maximum compatibility with this theme: %1$s.',
                    'hurumap'
                ),
                'notice_ask_to_update_maybe'      => _n_noop(
                    /* translators: 1: plugin name(s). */
                    'There is an update available for: %1$s.',
                    'There are updates available for the following plugins: %1$s.',
                    'hurumap'
                ),
                'notice_can_activate_required'    => _n_noop(
                    /* translators: 1: plugin name(s). */
                    'The following required plugin is currently inactive: %1$s.',
                    'The following required plugins are currently inactive: %1$s.',
                    'hurumap'
                ),
                'notice_can_activate_recommended' => _n_noop(
                    /* translators: 1: plugin name(s). */
                    'The following recommended plugin is currently inactive: %1$s.',
                    'The following recommended plugins are currently inactive: %1$s.',
                    'hurumap'
                ),
                'install_link'                    => _n_noop(
                    'Begin installing plugin',
                    'Begin installing plugins',
                    'hurumap'
                ),
                'update_link' 					  => _n_noop(
                    'Begin updating plugin',
                    'Begin updating plugins',
                    'hurumap'
                ),
                'activate_link'                   => _n_noop(
                    'Begin activating plugin',
                    'Begin activating plugins',
                    'hurumap'
                ),
                'return'                          => __( 'Return to Required Plugins Installer', 'hurumap' ),
                'plugin_activated'                => __( 'Plugin activated successfully.', 'hurumap' ),
                'activated_successfully'          => __( 'The following plugin was activated successfully:', 'hurumap' ),
                /* translators: 1: plugin name. */
                'plugin_already_active'           => __( 'No action taken. Plugin %1$s was already active.', 'hurumap' ),
                /* translators: 1: plugin name. */
                'plugin_needs_higher_version'     => __( 'Plugin not activated. A higher version of %s is needed for this theme. Please update the plugin.', 'hurumap' ),
                /* translators: 1: dashboard link. */
                'complete'                        => __( 'All plugins installed and activated successfully. %1$s', 'hurumap' ),
                'dismiss'                         => __( 'Dismiss this notice', 'hurumap' ),
                'notice_cannot_install_activate'  => __( 'There are one or more required or recommended plugins to install, update or activate.', 'hurumap' ),
                'contact_admin'                   => __( 'Please contact the administrator of this site for help.', 'hurumap' ),

                'nag_type'                        => '', // Determines admin notice type - can only be one of the typical WP notice classes, such as 'updated', 'update-nag', 'notice-warning', 'notice-info' or 'error'. Some of which may not work as expected in older WP versions.
            ),
        );

        tgmpa( $plugins, $config );
    }

}

function hurumap()
{
    global $hurumap;

    if (!isset($hurumap)) {
        $hurumap = new HURUmap();
        $hurumap->initialize();
    }
    return $hurumap;
}

hurumap();

endif;
