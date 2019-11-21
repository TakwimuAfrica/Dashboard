<?php

require 'vendor/autoload.php';
use Elasticsearch\ClientBuilder;
$hosts = [
    'es:9200',         // IP + Port
];
$client = ClientBuilder::create()
                    ->setHosts($hosts)
                    ->build();




?>

<h1>Search Results</h1>

<ul>
    <li>First Result</li>
    <li>Second Result</li>
</ul>