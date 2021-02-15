<?
require_once(ABSPATH . 'wp-admin/includes/file.php');

add_action('rest_api_init', 'register_routes');
function register_routes()
{
    $namespace = 'hurumap-data';
    $endpoint_charts = '/charts';
    register_rest_route($namespace, $endpoint_charts, array(
        array(
            'methods'               => 'GET',
            'callback'              => 'get_charts'
        ),
    ));
    register_rest_route($namespace, $endpoint_charts . '/(?P<chart_id>\d+)$', array(
        array(
            'methods'               => 'GET',
            'callback'              => 'get_charts'
        ),
    ));
    register_rest_route($namespace, $endpoint_charts . '/sync', array(
        array(
            'methods'               => 'PUT',
            'callback'              => 'sync_topics_to_charts'
        ),
    ));
    //flourish view route
    $endpoint_flourish_src = '/flourish/(?P<chart_id>\d+)';
    register_rest_route($namespace, $endpoint_flourish_src, array(
        array(
            'methods'               => 'GET',
            'callback'              => 'get_flourish_chart'
        ),
    ));
    //flourish assets route
    $endpoint_flourish_other_src = '/flourish/(?P<chart_id>\d+)/(?P<path>.+)$';
    register_rest_route($namespace, $endpoint_flourish_other_src, array(
        array(
            'methods'               => 'GET',
            'callback'              => 'get_flourish_chart'
        ),
    ));
    //flourish store file to media library
    $endpoint_flourish_zip = '/store/flourish';
    register_rest_route($namespace, $endpoint_flourish_zip, array(
        array(
            'methods'               => 'POST',
            'callback'              => 'store_flourish_zip'
        ),
    ));
}

function get_filtered_post($id) {
    $_post = get_post($id);
    return get_posts(['numberposts' => 1, 'post_type' => $_post->post_type, 'post__in' => [$_post->ID], 'suppress_filters' => 0])[0];
}

function sync_topics_to_charts($request) {
    relate_topics_to_pages();
    
    $response = new WP_REST_Response(array('ok' => true));
    $response->set_status(200);

    return $response;
}

function get_charts($request)
{
    $id = $request->get_param('chart_id');
    $type = $request->get_param('type');
    $sectioned = $request->get_param('sectioned');
    if ($id) {
        $post = get_filtered_post($id);

        if (!$post) {
            $response = new WP_REST_Response();
            $response->set_status(404);

            return $response;
        }

        if ($post->post_excerpt != 'hurumap' && $post->post_excerpt != 'flourish') {
            $response = new WP_REST_Response();
            $response->set_status(400);

            return $response;
        }

        $chart = json_decode($post->post_content, true);
        $chart['type'] = $post->post_excerpt;

        $post = get_filtered_post($chart["section"]);

        $chart["section"] = json_decode($post->post_content, true);

        if ($post->post_excerpt == 'hurumap') {
            $chart["visual"]['queryAlias'] = "v{$id}";
            if ($chart["stat"]) {
                $chart["stat"]['queryAlias'] = "v{$id}";
            }
        }

        $response = new WP_REST_Response($chart);

        $response->set_status(200);

        return $response;
    }

    $posts = get_posts(array(
        'posts_per_page'			=> -1,
        'post_type'					=> 'hurumap-visual',
        'post_status'				=> array('publish'),
        'suppress_filters'          => 0
    ));
    
    // Update $post_ids with a non false value.
    $charts = array();
    foreach( $posts as $post ) {
        $chart = json_decode($post->post_content, true);
        if (isset($type) && $post->post_excerpt != $type) {
            continue;
        }
        $chart['type'] = $post->post_excerpt;
        if ($post->post_excerpt == 'hurumap') {
            $chart["visual"]['queryAlias'] = "v{$chart['id']}";
            if ($chart["stat"]) {
                $chart["stat"]['queryAlias'] = "v{$chart['id']}";
            }
        }
        $charts[] = $chart;
    }

    if ($sectioned) {
        $posts = get_posts(array(
            'posts_per_page'			=> -1,
            'post_type'					=> 'hurumap-section',
            'post_status'				=> array('publish'),
            'suppress_filters'          => 0
        ));
        $sections = array();
        foreach( $posts as $post ) {
            $section = json_decode($post->post_content, true);
            $section['charts'] = array_values(array_filter($charts, function($a) use ($section) {
                return $a['section'] == $section['id'];
            }));
            $sections[] = $section;
        }
    
        usort($sections, function($a, $b) {
            return $a['order'] > $b['order'];
        });
    
        $response = new WP_REST_Response($sections);
    } else {
        $response = new WP_REST_Response($charts);
    }
    
    $response->set_status(200);

    return $response;
}

function get_flourish_chart($request)
{
    global $wpdb;

    WP_Filesystem();

    $id = $request->get_param('chart_id');
    $post = get_filtered_post($id);
    if ($post) {
        if ($post->post_excerpt != 'flourish' && $post->post_mime_type != 'application/zip' && $post->post_mime_type != 'application/x-zip-compressed') {
            die("Not a flourish chart/file id");
        }

        if ($post->post_excerpt == 'flourish') {
            $content = json_decode($post->post_content);
            $file_id = $content->fileId;
        } else {
            $file_id = $id;

            // Assign id with the chart post id
            $results = $wpdb->get_results( "SELECT * FROM {$wpdb->posts} WHERE post_content LIKE '%:{$file_id}%' AND post_excerpt = 'flourish'" );
            if ($results && $results[0]) {
                $id = $results[0]->ID;
            }
        }
    } else {
        die("Invalid id");
    }

    //assign directory and file
    $destination_dir = "flourish/zip" . $file_id . "/";
    $chart_zip_path = get_attached_file((int) $file_id);

    if (!is_dir($destination_dir)) {
        $oldmask = umask(0);
        if (!mkdir($destination_dir, 0777, true)) {
            die("Failed to create folders...");
        }
        umask($oldmask);
    }

    $z = new ZipArchive();
    if ($z->open($chart_zip_path, ZIPARCHIVE::CHECKCONS) === TRUE) {
        $z->extractTo($destination_dir);
        $z->close();
    } else {
        die("Failed to unzip file, Incompatible Archive" );
    }

    $member = "index.html";

    $path = $request->get_param('path');
    if ($path) {
        $path_parts = array();
        $path_list = explode("/", $path);

        // Use array_values to reset the keys instead
        foreach (array_values($path_list) as $i => $val) {
            if (strpos($val, '.') === false or $i === count($path_list) - 1) {
                $path_parts[] = $val;
            }
        }
        $member = join('/', $path_parts);
    }
    $file = file_get_contents($destination_dir . $member);
    if ($member === "index.html") {
        $allowed_hosts = array(
            // Local ENV
            'localhost:8080' => 'localhost', // to allow front-end running on diffent port
            // Dev ENV
            'codeforafrica.vercel.app' => 'codeforafrica.vercel.app',
            'outbreak-africa.vercel.app' => 'outbreak-africa.vercel.app',
            'dev.outbreak.africa' => 'outbreak.africa',
            // Prod ENV
            'covid19.outbreak.africa' => 'outbreak.africa',
            'outbreak.africa' => 'outbreak.africa'
        );
        $domain = 'hurumap.org';
        foreach($allowed_hosts as $domain_from => $domain_to) {
            if (substr($_SERVER['HTTP_HOST'], -strlen($domain_from)) === $domain_from) {
                $domain = $domain_to;
                break;
            }
        }
        $config_flourish_script = get_theme_file_uri('/assets/js/config-flourish.js');
        $script_content = "<style type='text/css'> body[style] { background: none !important; } </style>";
        $script_content .= "<script type='text/javascript'> document.domain = '$domain'; </script>";
        $script_content .= "<script type='text/javascript' src='{$config_flourish_script}'></script>";
        $script_content .= "<script type='text/javascript'> const chartId = '{$id}'; </script>";
        $script_content .= "<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/dom-to-image/2.6.0/dom-to-image.min.js'></script>";
        $base_url = site_url() . '/wp-json/hurumap-data/flourish/' . $id . "/";
        $base_tag = "<base href='{$base_url}'>";

        if ($file) {
            $file = str_replace('<head>', '<head>' . $base_tag, $file);
            $file = str_replace('</body>', $script_content . '</body>', $file);
        };
    }

    header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1

    if (strpos($member, '.html')) {
        header("Content-type: text/html");
    } else if (strpos($member, '.css')) {
        header("Content-type: text/css");
    } else if (strpos($member, '.js')) {
        header("Content-type: text/javascript");
    } else if (strpos($member, '.svg')) {
        header("Content-type: image/svg+xml");
    } else if (exif_imagetype($destination_dir . $member)) {
        header("Content-type: " . image_type_to_mime_type(exif_imagetype($destination_dir . $member)));
    }

    return new WP_REST_Response(array('text' => $file, 'format' => 'text'));
}

add_filter('rest_pre_serve_request', 'multiformat_rest_pre_serve_request', 10, 4);
function multiformat_rest_pre_serve_request($served, $result, $request, $server)
{
    if ($result->data['format'] && $result->data['format'] == 'text') {
        echo $result->data['text'];
        $served = true;
    }
    return $served;
}


function store_flourish_zip($request)
{
    $upload_file = wp_upload_bits($_FILES['file']['name'], null, file_get_contents($_FILES['file']['tmp_name']));
    if (!$upload_file['error']) {
        $attachment = array(
            'post_mime_type' => $_FILES['file']['type'],
            'post_parent' => $parent_post_id,
            'post_title' => preg_replace('/\.[^.]+$/', '', $_FILES['file']['name']),
            'post_content' => '',
            'post_status' => 'inherit'
        );
        $attachment_id = wp_insert_attachment($attachment, $upload_file['file']);
        if (!is_wp_error($attachment_id)) {
            require_once(ABSPATH . "wp-admin" . '/includes/image.php');
            $attachment_data = wp_generate_attachment_metadata($attachment_id, $upload_file['file']);
            wp_update_attachment_metadata($attachment_id,  $attachment_data);
        }
        $res = array('ok' => true, 'id' => $attachment_id, 'name' => $_FILES['file']['name']);
    } else {
        $res = array('ok' => false, 'name' => $upload_file['error'], 'id' => null);
    }

    $response = new WP_REST_Response($res);
    $response->set_status(200);
    return $response;
}
