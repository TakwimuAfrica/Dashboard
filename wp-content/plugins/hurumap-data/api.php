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
            'callback'              => 'update_or_create_chart'
        ),
    ));
    $endpoint_sections = '/sections';
    register_rest_route($namespace, $endpoint_sections, array(
        array(
            'methods'               => 'POST',
            'callback'              => 'update_or_create_sections'
        ),
    ));
}

function get_charts()
{
    global $wpdb;

    $hurumap = $wpdb->get_results("SELECT * FROM {$wpdb->base_prefix}hurumap_charts order by created_at desc");
    $flourish = $wpdb->get_results("SELECT * FROM {$wpdb->base_prefix}flourish_charts order by created_at desc");
    $sections = $wpdb->get_results("SELECT * FROM {$wpdb->base_prefix}chart_sections order by created_at desc");
    $response = new WP_REST_Response(array('hurumap' => $hurumap, 'flourish' => $flourish, 'sections' => $sections));
    $response->set_status(200);

    return $response;
}

function update_or_create_chart($request)
{
    global $wpdb;

    $json = $request->get_json_params();
    if (!$wpdb->update(
        "{$wpdb->base_prefix}hurumap_charts",
        $json,
        array('id' => $json['id'])
    )) {
        $wpdb->insert("{$wpdb->base_prefix}hurumap_charts", $json);
        $res = array('ok' => true, 'id' => $wpdb->insert_id);
    } else {
        $res = array('ok' => true);
    }
    $response = new WP_REST_Response($res);
    $response->set_status(200);

    return $response;
}

function update_or_create_sections($request)
{
    global $wpdb;

    $json = $request->get_json_params();
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

add_action('rest_api_init', 'register_routes');
