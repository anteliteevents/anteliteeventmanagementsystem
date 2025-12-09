<?php
/**
 * About Page
 */
?>

<div class="row">
    <div class="col-12">
        <h2 class="mb-4">About Event Management System</h2>
        
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">System Information</h5>
                <p class="card-text">
                    <strong>Application Name:</strong> <?php echo APP_NAME; ?><br>
                    <strong>Version:</strong> <?php echo APP_VERSION; ?><br>
                    <strong>PHP Version:</strong> <?php echo phpversion(); ?><br>
                    <strong>Server:</strong> <?php echo $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'; ?>
                </p>
            </div>
        </div>

        <div class="card mt-4">
            <div class="card-body">
                <h5 class="card-title">Features</h5>
                <ul>
                    <li>Event Creation and Management</li>
                    <li>Attendee Tracking</li>
                    <li>Event Status Management</li>
                    <li>Responsive Design</li>
                    <li>Database Integration with phpMyAdmin</li>
                </ul>
            </div>
        </div>
    </div>
</div>

