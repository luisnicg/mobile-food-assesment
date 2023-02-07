<?php
namespace Controller;

class BaseController {

  /**
   * Magic method.
   */
  public function __call($name, $arguments) {
    $this->output('', ['HTTP/1.1 404 Not Found']);
  }

  /**
   * Get the URI.
   */
  public function getUri() {
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $uri = explode( '/', $uri );
    return $uri;
  }

  /**
   * Get the query string.
   */
  public function getQueryString() {
    parse_str($_SERVER['QUERY_STRING'], $query);
    return $query;
  }

  /**
   * Expose data.
   */
  public function output($data, $headers = []) {
    header_remove('Set-Cookie');
    header('Access-Control-Allow-Origin: ' . ALLOWED_ORIGIN);
    if (is_array($headers) && count($headers)) {
        foreach ($headers as $header) {
            header($header);
        }
    }
    echo $data;
    exit;
  }
}