<?

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
    $success = $wpdb->query($wpdb->prepare("DELETE FROM {$wpdb->base_prefix}chart_charts WHERE id IN ({$placeholders})", $json));
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


add_action('rest_api_init', 'register_routes');
