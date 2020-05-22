<?php

/**
 * Plugin Name: HURUmap
 * Plugin URI: https://github.com/CodeForAfrica/HURUmap-Dashboard
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

        require plugin_dir_path( __FILE__ ) . 'utils.php';
        require plugin_dir_path( __FILE__ ) . 'api.php';
        require plugin_dir_path( __FILE__ ) . 'acf.php';
        require plugin_dir_path( __FILE__ ) . 'data.php';
        require plugin_dir_path( __FILE__ ) . 'helpers.php';
        require plugin_dir_path( __FILE__ ) . 'posttypes.php';

        register_activation_hook(__FILE__, 'activate_hurumap_data');
        register_deactivation_hook(__FILE__,  'deactivate_hurumap_data');

        add_action('init', array($this, 'hurumap_data_blocks_register'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('admin_menu', array($this, 'setup_admin_menu'));
    }
    
    function setup_admin_menu() {
        // add_menu_page('HURUmap Data', 'HURUmap Data', 'manage_options', 'hurumap-data', array($this, 'hurumap_data_root'));
        // Vars.
        $slug = 'edit.php?post_type=hurumap-visual';
        $cap = acf_get_setting('capability');
        
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
                'numberposts' => -1,
                'suppress_filters' => 0,
                'post_status' => array('publish', 'pending', 'draft', 'auto-draft', 'future', 'private', 'inherit', 'trash') 
              ]);
            $sections = array();
            foreach ($results as $result) {
                $decoded = json_decode($result->post_content);
                if ($decoded) {
                    array_push($sections, $decoded);
                }
            }

            /**
             * Provide index js with initial data
             * 
             * Get post then use get_posts to get the post with language filters
             */
            $_post = get_post();
            $post = get_posts([
                'numberposts' => 1, 
                'post_type' => $_post->post_type, 
                'post__in' => [$_post->ID], 
                'suppress_filters' => 0,
                'post_status' => array('publish', 'pending', 'draft', 'auto-draft', 'future', 'private', 'inherit', 'trash') 
            ])[0];

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
                'numberposts' => -1,
                'suppress_filters' => 0,
                'post_status' => array('publish', 'pending', 'draft', 'auto-draft', 'future', 'private', 'inherit', 'trash') 
              ]);
            $charts = array();
            foreach ($results as $result) {
                $decoded = json_decode($result->post_content);
                if ($decoded) {
                    array_push($charts, $decoded);
                }
            }
            $results = get_posts([
                'post_type' => 'hurumap-section',
                'numberposts' => -1, 
                'suppress_filters' => 0,
                'post_status' => array('publish', 'pending', 'draft', 'auto-draft', 'future', 'private', 'inherit', 'trash') 
              ]);
            $sections = array();
            foreach ($results as $result) {
                $decoded = json_decode($result->post_content);
                if ($decoded) {
                    array_push($sections, $decoded);
                }
            }

            $_section = get_post();
            $section = get_posts([
                'post_type' => $_section->post_type,
                'post__in' => [$_section->ID],
                'numberposts' => 1,
                'suppress_filters' => 0,
                'post_status' => array('publish', 'pending', 'draft', 'auto-draft', 'future', 'private', 'inherit', 'trash') 
              ])[0];

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
            if ($chart) {
                $chart_definition = json_decode($chart->post_content);
                $chart_definition->section = null;
                $chart->post_content = json_encode($chart_definition);
                wp_update_post($chart);
            }
        }
        foreach($add_charts as $_chart) {
            $chart = get_post($_chart->id);
            if ($chart) {
                $chart_definition = json_decode($chart->post_content);
                $chart_definition->section = $post_ID;
                $chart_definition->layout = $_chart->layout;
                $chart->post_content = json_encode($chart_definition);
                wp_update_post($chart);
            }
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
                $_post = get_post($post_id);
                $post = get_posts([
                    'numberposts' => 1,
                    'post_type' => $_post->post_type,
                    'post__in' => [$_post->ID],
                    'suppress_filters' => 0,
                    'post_status' => array('publish', 'pending', 'draft', 'auto-draft', 'future', 'private', 'inherit', 'trash')
                ])[0];
                echo $post->post_excerpt;
                break;
            case 'in_topics' : {
                $_post = get_post($post_id);
                $post = get_posts([
                    'numberposts' => 1,
                    'post_type' => $_post->post_type,
                    'post__in' => [$_post->ID],
                    'suppress_filters' => 0,
                    'post_status' => array('publish', 'pending', 'draft', 'auto-draft', 'future', 'private', 'inherit', 'trash')
                ])[0];
                $definition = json_decode($post->post_content, true);
                if ($definition && is_array($definition['inTopics'])) {
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
        
        register_block_type('hurumap/indicator-block', array(
            'editor_script' => 'hurumap-data-blocks-script',
        ));

        register_block_type('hurumap/section-row-chart-block', array(
            'editor_script' => 'hurumap-data-blocks-script',
        ));
        register_block_type('hurumap/section-row-block', array(
            'editor_script' => 'hurumap-data-blocks-script',
        ));

        register_block_type('hurumap/section-block', array(
            'editor_script' => 'hurumap-data-blocks-script',
        ));
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
