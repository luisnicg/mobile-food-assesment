<?php

define('ROOT_PATH', __DIR__ . '/../');
define('BASE_PATH', __DIR__ . '/../web');

require_once ROOT_PATH . 'vendor/autoload.php';
require_once ROOT_PATH . 'inc/config.php';
require_once ROOT_PATH.  '/web/Service/Cache.php';
require_once ROOT_PATH.  '/web/Controller/BaseController.php';

require_once ROOT_PATH . '/web/Controller/rest/MobileFoodResource.php';
