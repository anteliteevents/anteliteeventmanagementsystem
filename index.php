<?php
/**
 * Event Management System
 * Main Entry Point
 */

// Start session
session_start();

// Include configuration
require_once 'config/database.php';
require_once 'config/port-config.php';
require_once 'config/config.php';

// Include core files
require_once 'includes/functions.php';

// Set default timezone
date_default_timezone_set('Asia/Phnom_Penh');

// Route handling
$page = isset($_GET['page']) ? $_GET['page'] : 'home';

// Include header
include 'includes/header.php';

// Include page content
$page_file = 'pages/' . $page . '.php';
if (file_exists($page_file)) {
    include $page_file;
} else {
    include 'pages/404.php';
}

// Include footer
include 'includes/footer.php';
?>

