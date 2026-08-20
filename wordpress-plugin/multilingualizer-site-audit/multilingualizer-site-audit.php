<?php
/**
 * Plugin Name: Multilingualizer Site Audit
 * Description: Squarespace Weglot pricing calculator and consent-based website audit.
 * Version: 0.2.1
 * Author: Multilingualizer
 */

defined('ABSPATH') || exit;

define('MSA_VERSION', '0.2.1');
define('MSA_FILE', __FILE__);
define('MSA_DIR', plugin_dir_path(__FILE__));
define('MSA_URL', plugin_dir_url(__FILE__));

require_once MSA_DIR . 'includes/class-msa-pricing.php';
require_once MSA_DIR . 'includes/class-msa-html-audit.php';
require_once MSA_DIR . 'includes/class-msa-crawler.php';
require_once MSA_DIR . 'includes/class-msa-queue.php';
require_once MSA_DIR . 'includes/class-msa-dated-redirect.php';
require_once MSA_DIR . 'includes/class-msa-plugin.php';

register_activation_hook(__FILE__, [MSA_Queue::class, 'install']);
MSA_Plugin::boot();
