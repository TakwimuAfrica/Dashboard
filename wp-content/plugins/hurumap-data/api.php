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
     //flourish zip file route
     $endpoint_flourish_src = '/flourish/(?P<chart_id>\w+)$';
     register_rest_route($namespace, $endpoint_flourish_src, array(
         array(
             'methods'               => 'GET',
             'callback'              => 'get_flourish_chart'
         ),
     ));
    //flourish zip file route
    $endpoint_flourish_view = '/view/flourish/(?P<file_id>\d+)$';
    register_rest_route($namespace, $endpoint_flourish_view, array(
        array(
            'methods'               => 'GET',
            'callback'              => 'get_flourish_chart_view',
            'args'                  => array(
                    'file_id'    => array(
                    'validate_callback' => function($param, $request, $key) {
                        return is_numeric( $param );
                    }
                ),
              ),
        ),
    ));
    //flourish store file route
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
    $placeholders = implode(', ', array_fill(0, count($json), '%s'));
    $success = $wpdb->query($wpdb->prepare("DELETE FROM {$wpdb->base_prefix}flourish_charts WHERE id IN ({$placeholders})", $json));
    $response = new WP_REST_Response($success);
    $response->set_status(200);
    return $response;
}

function get_flourish_chart($request)
{
    global $wpdb;

    WP_Filesystem();

    $chart_id = $request->get_param('chart_id');
    $flourish = $wpdb->get_results($wpdb->prepare("SELECT * FROM {$wpdb->base_prefix}flourish_charts where id=%s and published='1'  LIMIT 1", $chart_id));
    $file_content = $flourish[0]->file;

    //assign directory and file
    $destination_dir = "flourish/zip" . $chart_id . "/";
    $new_file_path = $destination_dir . "zip" . $chart_id . ".zip";
    $chart_zip_path = get_attached_file( (int)$flourish[0]->media);

    if (!is_dir($destination_dir)) {
        $oldmask = umask(0);
        if (!mkdir($destination_dir, 0777, true )) {
            echo "Failed to create folders...";
        }
        umask($oldmask);
    }

    $unzipfile = unzip_file($chart_zip_path, $destination_dir);
    $member = "index.html";
    
    $response = new WP_REST_Response(array('flourish' => $flourish));
    $response->set_status(200);

    return $response;
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
        $attachment_id = wp_insert_attachment( $attachment, $upload_file['file'] );
        if (!is_wp_error($attachment_id)) {
            require_once(ABSPATH . "wp-admin" . '/includes/image.php');
            $attachment_data = wp_generate_attachment_metadata( $attachment_id, $upload_file['file'] );
            wp_update_attachment_metadata( $attachment_id,  $attachment_data );
        } 
        $res = array('ok' =>true,'id' => $attachment_id);   
    } else {
        echo $upload_file['error'];
        $res = array('ok' =>true,'id' => null);
    }
    
    $response = new WP_REST_Response($res);
    $response->set_status(200);
    return $response;
}

function get_flourish_chart_view($json) {
    $id = $json['file_id'];
    $member = "index.html";
    $destination_dir = "flourish/zip" . $id;
    if (!is_dir($destination_dir)) {
        if (!mkdir($destination_dir, 0777)) {
            echo "Failed to create folders...";
        }
    }
    $file_path = wp_get_attachment_url($id);
    $new_file_path = $destination_dir . "/" . $id . '.zip';
    echo $id;
    var_dump($file_path);
    $ch = curl_init(); //new cURL 
    curl_setopt($ch, CURLOPT_URL, $file_path);
    curl_setopt($ch, CURLOPT_PROXYPORT, 8080);
    $data = curl_exec ($ch);
    curl_close ($ch);
    // save as wordpress.zip
    var_dump($data);
    $file = fopen($new_file_path, "wb");
    fputs($file, $data);
    fclose($file);
    echo $new_file_path;
    $zip = new ZipArchive;
    $code = $zip->open($new_file_path);
    if ( $code === TRUE) {
        $extract = $zip->extractTo($destination_dir ."/");
        echo $extract;
        $zip->close();
        echo 'ok';
    } else {
        echo $code;
    }
    $contents = file_get_contents($destination_dir . "/" . $member);
    // $script_content = '<script type="text/javascript">\n\t document.domain = "takwimu.africa";\n</script>';
    // if ($contents) {
    //     $contents = str_replace('</body>', $script_content . '</body>', $contents);
    // }
    $res = array('ok' =>true,'view' => $contents);
    $response = new WP_REST_Response($res);
    $response->set_status(200);
    return $response;
}


add_action('rest_api_init', 'register_routes');
