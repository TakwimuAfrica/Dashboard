<?
require_once(ABSPATH . 'wp-admin/includes/file.php');
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
    register_rest_route($namespace, $endpoint_charts, array(
        array(
            'methods'               => 'POST',
            'callback'              => 'update_or_create_charts'
        ),
    ));
    register_rest_route($namespace, $endpoint_charts, array(
        array(
            'methods'               => 'DELETE',
            'callback'              => 'delete_charts'
        ),
    ));
    $endpoint_sections = '/sections';
    register_rest_route($namespace, $endpoint_sections, array(
        array(
            'methods'               => 'POST',
            'callback'              => 'update_or_create_sections'
        ),
    ));
    register_rest_route($namespace, $endpoint_sections, array(
        array(
            'methods'               => 'DELETE',
            'callback'              => 'delete_sections'
        ),
    ));
    $endpoint_sections = '/definitions';
    register_rest_route($namespace, $endpoint_sections, array(
        array(
            'methods'               => 'POST',
            'callback'              => 'sync_chart_definitions'
        ),
    ));

    //flourish charts endpoints
    $endpoint_flourish = '/flourish';
    register_rest_route($namespace, $endpoint_flourish, array(
        array(
            'methods'               => 'POST',
            'callback'              => 'update_or_create_flourish_charts'
        ),
    ));
    register_rest_route($namespace, $endpoint_flourish, array(
        array(
            'methods'               => 'DELETE',
            'callback'              => 'delete_flourish_charts'
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

function sync_chart_definitions($request)
{
    global $wpdb;
    $json = $request->get_json_params();
    foreach ($json as $section) {
        if (!$wpdb->update(
            "{$wpdb->base_prefix}chart_sections",
            array('id' => $section['id'], 'name' => $section['name'], 'description' => $section['description']),
            array('id' => $section['id'])
        )) {
            $wpdb->insert("{$wpdb->base_prefix}chart_sections", array('id' => $section['id'], 'name' => $section['name'], 'description' => $section['description']));
        }
        foreach ($section['charts'] as $chart) {
            $chart['section'] = $section['id'];
            $chart['visual'] = json_encode($chart['visual']);
            $chart['stat'] = json_encode($chart['stat']);
            if (!$wpdb->update(
                "{$wpdb->base_prefix}hurumap_charts",
                $chart,
                array('id' => $chart['id'])
            )) {
                $wpdb->insert("{$wpdb->base_prefix}hurumap_charts", $chart);
            }
        }
    }
    $response = new WP_REST_Response();
    $response->set_status(200);

    return $response;
}

function get_charts($request)
{
    global $wpdb;


    $published = $request->get_param('published');
    $placeholders = implode(', ',  array_fill(0, $published == null ? 2 : 1, '%s'));
    $values = $published === null ? [0, 1] : [$published == '1'];

    $hurumap = $wpdb->get_results($wpdb->prepare("SELECT * FROM {$wpdb->base_prefix}hurumap_charts where published IN ({$placeholders}) order by created_at desc", $values));
    $flourish = $wpdb->get_results($wpdb->prepare("SELECT * FROM {$wpdb->base_prefix}flourish_charts where published IN ({$placeholders}) order by created_at desc", $values));
    $sections = $wpdb->get_results($wpdb->prepare("SELECT * FROM {$wpdb->base_prefix}chart_sections where published IN ({$placeholders}) order by created_at desc", $values));
    $response = new WP_REST_Response(array('hurumap' => $hurumap, 'flourish' => $flourish, 'sections' => $sections));
    $response->set_status(200);

    return $response;
}

function update_or_create_chart($json)
{
    global $wpdb;

    if (!$wpdb->update(
        "{$wpdb->base_prefix}hurumap_charts",
        $json,
        array('id' => $json['id'])
    )) {
        $wpdb->insert("{$wpdb->base_prefix}hurumap_charts", $json);
    }
}

function update_or_create_charts($request)
{
    $json = $request->get_json_params();
    if (is_array($json[0])) {
        foreach ($json as $chart) {
            update_or_create_chart($chart);
        }
    } else {
        update_or_create_chart($json);
    }
    $response = new WP_REST_Response();
    $response->set_status(200);

    return $response;
}

function delete_charts($request)
{
    global $wpdb;

    $json = $request->get_json_params();
    $placeholders = implode(', ', array_fill(0, count($json), '%s'));
    $success = $wpdb->query($wpdb->prepare("DELETE FROM {$wpdb->base_prefix}hurumap_charts WHERE id IN ({$placeholders})", $json));
    $response = new WP_REST_Response($success);
    $response->set_status(200);

    return $response;
}


function update_or_create_section($json)
{
    global $wpdb;

    if (!$wpdb->update(
        "{$wpdb->base_prefix}chart_sections",
        $json,
        array('id' => $json['id'])
    )) {
        $wpdb->insert("{$wpdb->base_prefix}chart_sections", $json);
        $res = array('ok' => true, 'id' => $wpdb->insert_id);
    } else {
        $res = array('ok' => true);
    }
    $response = new WP_REST_Response($res);
    $response->set_status(200);
}

function update_or_create_sections($request)
{
    $json = $request->get_json_params();
    if (is_array($json[0])) {
        foreach ($json as $section) {
            update_or_create_section($section);
        }
    } else {
        update_or_create_section($json);
    }
    $response = new WP_REST_Response();
    $response->set_status(200);
}

function delete_sections($request)
{
    global $wpdb;

    $json = $request->get_json_params();
    $placeholders = implode(', ', array_fill(0, count($json), '%s'));
    $success = $wpdb->query($wpdb->prepare("DELETE FROM {$wpdb->base_prefix}chart_sections WHERE id IN ({$placeholders})", $json));
    $response = new WP_REST_Response($success);
    $response->set_status(200);

    return $response;
}

function update_or_create_flourish_chart($json)
{
    global $wpdb;
    var_dump($json);
    if (!$wpdb->update(
        "{$wpdb->base_prefix}flourish_charts",
        $json,
        array('id' => $json['id'])
    )) {
        $wpdb->insert("{$wpdb->base_prefix}flourish_charts", $json);
    }
}
function update_or_create_flourish_charts($request)
{
    $json = $request->get_json_params();
    if (is_array($json[0])) {
        foreach ($json as $chart) {
            update_or_create_flourish_chart($chart);
        }
    } else {
        update_or_create_flourish_chart($json);
    }
    $response = new WP_REST_Response();
    $response->set_status(200);
    return $response;
}


function delete_flourish_charts($request)
{
    global $wpdb;
    $json = $request->get_json_params();
    $success = $wpdb->delete($wpdb->base_prefix . "flourish_charts", array('id' => $json['id']));
    $response = new WP_REST_Response($success);
    $response->set_status(200);
    return $response;
}

function get_flourish_chart($request)
{
    global $wpdb;

    WP_Filesystem();

    $chart_id = $request->get_param('chart_id');
    $flourish = $wpdb->get_results($wpdb->prepare("SELECT * FROM {$wpdb->base_prefix}flourish_charts where id=%s  LIMIT 1", $chart_id));
    $file_content = $flourish[0]->file;

    //assign directory and file
    $destination_dir = "flourish/zip" . $chart_id . "/";
    $chart_zip_path = get_attached_file((int) $flourish[0]->media_id);

    if (!is_dir($destination_dir)) {
        $oldmask = umask(0);
        if (!mkdir($destination_dir, 0777, true)) {
            die("Failed to create folders...");
        }
        umask($oldmask);
    }

    $unzip = unzip_file($chart_zip_path, $destination_dir);

    if ($unzip->errors) {
        die("Failed to unzip file, " . $unzip->get_error_message());
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
        /**
         * Add html2Canvas to allow the iframe to be downloadable
         * Add hostname so that we can access iframe document from subdomain
         */
        $hostname = $request['origin'] ? $request['origin'] : $_SERVER['HTTP_HOST'];
        $config_flourish_script = get_theme_file_uri('/assets/js/config-flourish.js');
        $script_content = "<style type='text/css'> body[style] { background: none !important; } </style><script type='text/javascript' src='{$config_flourish_script}'><script type='text/javascript' src='https://cdn.jsdelivr.net/npm/html2canvas@1.0.0-rc.1/dist/html2canvas.min.js'></script><script type='text/javascript'> document.domain = '{$hostname}'; </script>";
        if ($file) {
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
        header("Content-type: ". image_type_to_mime_type(exif_imagetype($destination_dir . $member)));
    }

    return new WP_REST_Response(array( 'text' => $file, 'format' => 'text' ));
    }

add_filter( 'rest_pre_serve_request', 'multiformat_rest_pre_serve_request', 10, 4 );
function multiformat_rest_pre_serve_request( $served, $result, $request, $server ) {
    if ($result->data['format'] && $result->data['format'] == 'text') {
        echo $result->data['text'];
        $served = true;
    }
	return $served;
}


function store_flourish_zip($request)
{
    global $wpdb;

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
        echo $upload_file['error'];
        $res = array('ok' => true, 'id' => null);
    }

    $response = new WP_REST_Response($res);
    $response->set_status(200);
    return $response;
}


add_action('rest_api_init', 'register_routes');
