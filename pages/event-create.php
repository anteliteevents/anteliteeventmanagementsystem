<?php
/**
 * Create Event Page
 */
require_once '../config/database.php';

$message = '';
$message_type = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $conn = getDBConnection();
    
    $title = sanitize($_POST['title'] ?? '');
    $description = sanitize($_POST['description'] ?? '');
    $event_date = $_POST['event_date'] ?? '';
    $event_time = $_POST['event_time'] ?? '';
    $location = sanitize($_POST['location'] ?? '');
    $status = $_POST['status'] ?? 'upcoming';
    
    if (!empty($title) && !empty($event_date)) {
        $stmt = $conn->prepare("INSERT INTO events (title, description, event_date, event_time, location, status) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $title, $description, $event_date, $event_time, $location, $status);
        
        if ($stmt->execute()) {
            showAlert('Event created successfully!', 'success');
            redirect(BASE_URL . '?page=events');
        } else {
            $message = 'Error creating event: ' . $conn->error;
            $message_type = 'danger';
        }
        $stmt->close();
    } else {
        $message = 'Please fill in all required fields.';
        $message_type = 'warning';
    }
    $conn->close();
}
?>

<div class="row">
    <div class="col-md-8 offset-md-2">
        <h2 class="mb-4"><i class="bi bi-plus-circle"></i> Create New Event</h2>
        
        <?php if ($message): ?>
        <div class="alert alert-<?php echo $message_type; ?>">
            <?php echo $message; ?>
        </div>
        <?php endif; ?>
        
        <form method="POST" action="">
            <div class="mb-3">
                <label for="title" class="form-label">Event Title <span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="title" name="title" required>
            </div>
            
            <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea class="form-control" id="description" name="description" rows="4"></textarea>
            </div>
            
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="event_date" class="form-label">Event Date <span class="text-danger">*</span></label>
                    <input type="date" class="form-control" id="event_date" name="event_date" required>
                </div>
                
                <div class="col-md-6 mb-3">
                    <label for="event_time" class="form-label">Event Time</label>
                    <input type="time" class="form-control" id="event_time" name="event_time">
                </div>
            </div>
            
            <div class="mb-3">
                <label for="location" class="form-label">Location</label>
                <input type="text" class="form-control" id="location" name="location">
            </div>
            
            <div class="mb-3">
                <label for="status" class="form-label">Status</label>
                <select class="form-select" id="status" name="status">
                    <option value="upcoming" selected>Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>
            
            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                <a href="<?php echo BASE_URL; ?>?page=events" class="btn btn-secondary">Cancel</a>
                <button type="submit" class="btn btn-primary">Create Event</button>
            </div>
        </form>
    </div>
</div>

