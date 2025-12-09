<?php
/**
 * Home Page
 */
?>

<div class="row">
    <div class="col-12">
        <div class="jumbotron bg-light p-5 rounded mb-4">
            <h1 class="display-4">Welcome to Event Management System</h1>
            <p class="lead">Manage your events efficiently with our comprehensive event management solution.</p>
            <hr class="my-4">
            <p>Get started by creating your first event or exploring existing events.</p>
            <a class="btn btn-primary btn-lg" href="<?php echo BASE_URL; ?>?page=events" role="button">
                <i class="bi bi-calendar-event"></i> View Events
            </a>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-md-4 mb-4">
        <div class="card">
            <div class="card-body">
                <h5 class="card-title"><i class="bi bi-calendar-check"></i> Event Management</h5>
                <p class="card-text">Create, update, and manage your events with ease.</p>
            </div>
        </div>
    </div>
    <div class="col-md-4 mb-4">
        <div class="card">
            <div class="card-body">
                <h5 class="card-title"><i class="bi bi-people"></i> Attendee Tracking</h5>
                <p class="card-text">Track and manage event attendees efficiently.</p>
            </div>
        </div>
    </div>
    <div class="col-md-4 mb-4">
        <div class="card">
            <div class="card-body">
                <h5 class="card-title"><i class="bi bi-bar-chart"></i> Reports & Analytics</h5>
                <p class="card-text">Generate reports and analyze event data.</p>
            </div>
        </div>
    </div>
</div>

