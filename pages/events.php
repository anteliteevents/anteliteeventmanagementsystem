<?php
/**
 * Events Page
 */
require_once '../config/database.php';

$conn = getDBConnection();

// Check if events table exists, if not create it
$table_check = "SHOW TABLES LIKE 'events'";
$result = $conn->query($table_check);

if ($result->num_rows == 0) {
    // Create events table
    $create_table = "CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        event_date DATE NOT NULL,
        event_time TIME,
        location VARCHAR(255),
        status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";
    
    $conn->query($create_table);
}

// Fetch events
$sql = "SELECT * FROM events ORDER BY event_date DESC, event_time DESC";
$result = $conn->query($sql);
?>

<div class="row">
    <div class="col-12">
        <h2 class="mb-4"><i class="bi bi-calendar-event"></i> Events</h2>
        
        <div class="mb-3">
            <a href="<?php echo BASE_URL; ?>?page=event-create" class="btn btn-primary">
                <i class="bi bi-plus-circle"></i> Create New Event
            </a>
        </div>

        <?php if ($result && $result->num_rows > 0): ?>
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php while ($event = $result->fetch_assoc()): ?>
                        <tr>
                            <td><?php echo htmlspecialchars($event['title']); ?></td>
                            <td><?php echo formatDate($event['event_date']); ?></td>
                            <td><?php echo $event['event_time'] ? date('H:i', strtotime($event['event_time'])) : 'N/A'; ?></td>
                            <td><?php echo htmlspecialchars($event['location'] ?? 'N/A'); ?></td>
                            <td>
                                <span class="badge bg-<?php 
                                    echo $event['status'] == 'upcoming' ? 'primary' : 
                                        ($event['status'] == 'ongoing' ? 'success' : 
                                        ($event['status'] == 'completed' ? 'secondary' : 'danger')); 
                                ?>">
                                    <?php echo ucfirst($event['status']); ?>
                                </span>
                            </td>
                            <td>
                                <a href="<?php echo BASE_URL; ?>?page=event-view&id=<?php echo $event['id']; ?>" class="btn btn-sm btn-info">
                                    <i class="bi bi-eye"></i> View
                                </a>
                            </td>
                        </tr>
                        <?php endwhile; ?>
                    </tbody>
                </table>
            </div>
        <?php else: ?>
            <div class="alert alert-info">
                <i class="bi bi-info-circle"></i> No events found. Create your first event to get started!
            </div>
        <?php endif; ?>
    </div>
</div>

<?php
$conn->close();
?>

