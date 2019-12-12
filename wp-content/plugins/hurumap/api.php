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
    register_rest_route($namespace, $endpoint_charts . '/(?P<chart_id>[\w\-]+)$', array(
        array(
            'methods'               => 'GET',
            'callback'              => 'get_charts'
        ),
    ));
    //flourish view route
    $endpoint_flourish_src = '/flourish/(?P<chart_id>[\w\-]+)$';
    register_rest_route($namespace, $endpoint_flourish_src, array(
        array(
            'methods'               => 'GET',
            'callback'              => 'get_flourish_chart'
        ),
    ));
    //flourish assets route
    $endpoint_flourish_other_src = '/flourish/(?P<chart_id>[\w\-]+)/(?P<path>.+)$';
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

function get_charts($request)
{
    $id = $request->get_param('chart_id');
    $type = $request->get_param('type');
    $sectioned = $request->get_param('sectioned');
    if ($id) {
        $post = get_post($id);
        $chart = json_decode($post->post_content, true);
        $chart['type'] = $post->post_excerpt;
        $post = get_post($chart["section"]);
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
        'post_status'				=> array('publish')
    ));
    
    // Update $post_ids with a non false value.
    $charts = array();
    foreach( $posts as $post ) {
        $chart = json_decode($post->post_content, true);
        if (isset($type) && $post->post_excerpt == $type) {
            $chart['type'] = $post->post_excerpt;
            if ($post->post_excerpt == 'hurumap') {
                $chart["visual"]['queryAlias'] = "v{$chart['id']}";
                if ($chart["stat"]) {
                    $chart["stat"]['queryAlias'] = "v{$chart['id']}";
                }
            }
            $charts[] = $chart;
        }
    }

    if ($sectioned) {
        $posts = get_posts(array(
            'posts_per_page'			=> -1,
            'post_type'					=> 'hurumap-section',
            'post_status'				=> array('publish')
        ));
        $sections = array();
        foreach( $posts as $post ) {
            $section = json_decode($post->post_content);
            $section->charts = array_filter($charts, function($a) use ($section) {
                return $a['section'] == $section->id;
            });
            $sections[] = $section;
        }
    
        usort($sections, function($a, $b) {
            return $a->order > $b->order;
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
    WP_Filesystem();

    $id = $request->get_param('chart_id');
    $post = get_post($id);
    if ($post) {
        $content = json_encode($post->post_content);
        $file_id = $content->fileId;
    }

    //assign directory and file
    $destination_dir = "flourish/zip" . $id . "/";
    $chart_zip_path = get_attached_file((int) $file_id | $id);

    if (!is_dir($destination_dir)) {
        $oldmask = umask(0);
        if (!mkdir($destination_dir, 0777, true)) {
            die("Failed to create folders...");
        }
        umask($oldmask);
    }

    $unzip = unzip_file($chart_zip_path, $destination_dir);

    if ($unzip->errors) {
        die("Failed to unzip file, " . $unzip->get_error_message() );
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
        $domain = strpos($_SERVER['HTTP_HOST'], 'localhost:8080') !== false ? 'localhost' : 'takwimu.africa';
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
