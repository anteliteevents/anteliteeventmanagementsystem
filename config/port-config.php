<?php
/**
 * Port Configuration
 * 
 * This file allows you to manually configure a specific port
 * If you want to use a fixed port, uncomment and set the PORT constant
 */

// Uncomment and set your desired port (e.g., 8080, 3000, 8000, etc.)
// define('CUSTOM_PORT', 8080);

// If CUSTOM_PORT is set, prepare the override (will be applied in config.php)
if (defined('CUSTOM_PORT')) {
    // Build base URL with custom port
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $hostParts = explode(':', $host);
    $hostOnly = $hostParts[0]; // Remove existing port if any
    
    $scriptName = $_SERVER['SCRIPT_NAME'] ?? '/index.php';
    $scriptDir = dirname($scriptName);
    
    $baseUrl = $protocol . '://' . $hostOnly . ':' . CUSTOM_PORT;
    
    if ($scriptDir !== '/' && $scriptDir !== '\\') {
        $baseUrl .= rtrim($scriptDir, '/\\') . '/';
    } else {
        $baseUrl .= '/';
    }
    
    // Store in global for config.php to use
    $GLOBALS['BASE_URL_OVERRIDE'] = $baseUrl;
}

?>

