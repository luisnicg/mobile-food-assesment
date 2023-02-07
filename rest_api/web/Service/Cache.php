<?php
namespace Service;

use Exception;
use Phpfastcache\CacheManager;
use Phpfastcache\Config\ConfigurationOption;

class Cache {
  // Cache instance.
  protected $instanceCache;

  // Cache data.
  public $data;

  public function __construct() {
    // Setup File Path on your config files
    // Please note that as of the V6.1 the "path" config 
    // can also be used for Unix sockets (Redis, Memcache, etc)
    CacheManager::setDefaultConfig(new ConfigurationOption([
      'path' => TMP_DIR,
    ]));

    // In your class, function, you can call the Cache
    $this->instanceCache = CacheManager::getInstance('files');
  }

  /**
   * Set cache.
   * 
   * @var string $key
   *  Cache key.
   * @var mix $data
   *  Data to be stored.
   * @var int $expire
   *  Expiration time in seconds.
   */
  public function set($key, $data, $expire = 5) {

    if (empty($key)) {
      throw new Exception('Key is required.');
    }

    $cachedString = $this->instanceCache->getItem($key);

    $cachedString->set($data)->expiresAfter($expire);
    $this->instanceCache->save($cachedString);
  }

  /**
   * Get cache.
   * 
   * @var string $key
   *  Cache key.
   */
  public function get($key) {
    if (empty($key)) {
      throw new Exception('Key is required.');
    }

    $cachedString = $this->instanceCache->getItem($key);

    if ($cachedString->isHit()) {
      $this->data = $cachedString->get();
      return $this;
    }
    else {
      return FALSE;
    }
  }

  /**
   * Delete cache by key.
   * 
   * @var string $key
   *  Cache key.
   */
  public function delete($key) {
    $this->instanceCache->delete($key);
  }

  /**
   * Clear cache.
   */
  public function clear() {
    $this->instanceCache->clear();
  }

  /**
   * Get the cache instance.
   */
  public function getInstanceCache() {
    return $this->instanceCache;
  }
}