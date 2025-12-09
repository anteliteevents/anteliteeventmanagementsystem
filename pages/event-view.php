<?php
/**
 * View Event Page
 */
require_once '../config/database.php';

$event_id = $_GET['id'] ?? 0;

if (!$event_id) {
    redirect(BASE_URL . '?page=events');
}

$conn = getDBConnection();
$stmt = $conn->prepare("SELECT * FROM events WHERE id = ?");
$stmt->bind_param("i", $event_id);
$stmt->execute();
$result = $stmt->get_result();
$event = $result->fetch_assoc();
$stmt->close();
$conn->close();

if (!$event) {
    redirect(BASE_URL . '?page=events');
}
?>

<div class="row">
    <div class="col-md-8 offset-md-2">
        <div class="card">
            <div class="card-header">
                <h3><?php echo htmlspecialchars($event['title']); ?></h3>
            </div>
            <div class="card-body">
                <p><strong>Status:</strong> 
                    <span class="badge bg-<?php 
                        echo $event['status'] == 'upcoming' ? 'primary' : 
                            ($event['status'] == 'ongoing' ? 'success' : 
                            ($event['status'] == 'completed' ? 'secondary' : 'danger')); 
                    ?>">
                        <?php echo ucfirst($event['status']); ?>
                    </span>
                </p>
                
                <p><strong>Date:</strong> <?php echo formatDate($event['event_date']); ?></p>
                
                <?php if ($event['event_time']): ?>
                <p><strong>Time:</strong> <?php echo date('H:i', strtotime($event['event_time'])); ?></p>
                <?php endif; ?>
                
                <?php if ($event['location']): ?>
                <p><strong>Location:</strong> <?php echo htmlspecialchars($event['location']); ?></p>
                <?php endif; ?>
                
                <?php if ($event['description']): ?>
                <hr>
                <p><strong>Description:</strong></p>
                <p><?php echo nl2br(htmlspecialchars($event['description'])); ?></p>
                <?php endif; ?>
                
                <hr>
                <p class="text-muted">
                    <small>
                        Created: <?php echo formatDateTime($event['created_at']); ?><br>
                        Updated: <?php echo formatDateTime($event['updated_at']); ?>
                    </small>
                </p>
            </div>
            <div class="card-footer">
                <a href="<?php echo BASE_URL; ?>?page=events" class="btn btn-secondary">
                    <i class="bi bi-arrow-left"></i> Back to Events
                </a>
            </div>
        </div>
    </div>
</div>

