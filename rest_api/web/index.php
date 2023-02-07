<?php

use Controller\rest\MobileFoodResource;

require __DIR__ . '/../inc/bootstrap.php';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode( '/', $uri );

$callback = new MobileFoodResource();
$requestMethod = strtolower($_SERVER['REQUEST_METHOD']);
$callback->{$requestMethod}();