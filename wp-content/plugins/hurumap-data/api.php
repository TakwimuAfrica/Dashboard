<?

function register_routes()
{
    $namespace = 'hurumap-data';
    $endpoint = '/charts';
    register_rest_route($namespace, $endpoint, array(
        array(
            'methods'               => 'GET',
            'callback'              => 'get_charts'
        ),
    ));
    register_rest_route($namespace, $endpoint, array(
        array(
            'methods'               => 'POST',
            'callback'              => 'update_or_create_chart'
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

function create_chart($request)
{
    global $wpdb;
    $json = $request->get_json_params();

    $wpdb->insert("{$wpdb->base_prefix}hurumap_charts", $json);
    $response = new WP_REST_Response(array('id' => $wpdb->insert_id));
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
        $res = array( 'ok' => true, 'id' => $wpdb->insert_id );
    } else {
        $res = array( 'ok' => true );
    }
    $response = new WP_REST_Response($res);
    $response->set_status(200);

    return $response;
}

add_action('rest_api_init', 'register_routes');
