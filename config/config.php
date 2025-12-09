<?php
/**
 * Application Configuration
 */

// Application Settings
define('APP_NAME', 'Event Management System');
define('APP_VERSION', '1.0.0');

// Auto-detect BASE_URL with port support
function getBaseUrl() {
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $serverPort = $_SERVER['SERVER_PORT'] ?? 80;
    
    // Check if port is already in HTTP_HOST (e.g., localhost:8080)
    $hostParts = explode(':', $host);
    $hostOnly = $hostParts[0];
    $portInHost = isset($hostParts[1]) ? (int)$hostParts[1] : null;
    
    // Get the script directory
    $scriptName = $_SERVER['SCRIPT_NAME'] ?? '/index.php';
    $scriptDir = dirname($scriptName);
    
    // Build base URL
    $baseUrl = $protocol . '://' . $host;
    
    // If port is not in HTTP_HOST, add it if it's not standard
    if ($portInHost === null) {
        $standardPort = ($protocol === 'http') ? 80 : 443;
        if ($serverPort != $standardPort) {
            $baseUrl = $protocol . '://' . $hostOnly . ':' . $serverPort;
        } else {
            $baseUrl = $protocol . '://' . $hostOnly;
        }
    }
    
    // Add script directory if not root
    if ($scriptDir !== '/' && $scriptDir !== '\\') {
        $baseUrl .= rtrim($scriptDir, '/\\') . '/';
    } else {
        $baseUrl .= '/';
    }
    
    return $baseUrl;
}

// Define BASE_URL (auto-detected or can be manually set)
if (!defined('BASE_URL')) {
    // Check for port override from port-config.php
    if (isset($GLOBALS['BASE_URL_OVERRIDE'])) {
        define('BASE_URL', $GLOBALS['BASE_URL_OVERRIDE']);
    } else {
        // You can manually override by setting BASE_URL before including this file
        // Or let it auto-detect from server environment
        define('BASE_URL', getBaseUrl());
    }
}

// Helper function to get BASE_URL (handles override)
function getBaseUrlValue() {
    if (isset($GLOBALS['BASE_URL_OVERRIDE'])) {
        return $GLOBALS['BASE_URL_OVERRIDE'];
    }
    return defined('BASE_URL') ? BASE_URL : getBaseUrl();
}

// Paths
define('ROOT_PATH', __DIR__ . '/../');
define('INCLUDES_PATH', ROOT_PATH . 'includes/');
define('PAGES_PATH', ROOT_PATH . 'pages/');
define('ASSETS_PATH', ROOT_PATH . 'assets/');

// Error Reporting (set to 0 in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Session Configuration
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', 0); // Set to 1 if using HTTPS

?>

