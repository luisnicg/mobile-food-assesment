<?php
namespace Controller\rest;

use Service\Cache;
use Controller\BaseController;
use JsonPath\JsonObject;
use Exception;

class MobileFoodResource extends BaseController {
  public function get() {
    $cache = new Cache();

    $queryString = $this->getQueryString();

    if (isset($queryString['key'])) {
      $cid = base64_encode('mobile_food_json_2' . $queryString['key']);
    }
    else {
      $cid = base64_encode('mobile_food_json_2');
    }

    $errorDesc = '';
    $response = [];

    try {
      $response = '';
      // if ($cached_data = $cache->get($cid)) {
      if (FALSE) {
        $response = $cached_data->data;
      }
      else {
        $csv = array_map('str_getcsv', file(CSV_PATH));
        array_walk($csv, function(&$row) use ($csv) {
          $row = array_combine($csv[0], $row);
        });
        array_shift($csv);

        $response = json_encode($csv);

        if (isset($queryString['key'])) {
          $jsonObject = new JsonObject($response);
          $result = $jsonObject->{"$[?(@.FacilityType=='" . $queryString['key'] . "')]"}; 
          $response = json_encode($result);
        }

        $cache->set($cid, $response, 3600);
      }
    }
    catch (Exception $e) {
      $errorDesc = $e->getMessage().'. Something went wrong.';
      $errorHeader = 'HTTP/1.1 500 Internal Server Error';
    }

    if (empty($errorDesc)) {
      $this->output($response, ['Content-Type: application/json', 'HTTP/1.1 200 OK']);
    }
    else {
      $error = [
        'error' => $errorDesc,
      ];
      $this->output(json_encode($error), ['Content-Type: application/json', $errorHeader]);
    }
  }
}