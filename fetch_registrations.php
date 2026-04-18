<?php
/* ============================================
   LUMINAE EVENTS — FETCH ALL REGISTRATIONS
   php/fetch_registrations.php
============================================ */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'luminae_db');

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . $conn->connect_error
    ]);
    exit;
}

// Fetch all registrations ordered by newest first
$result = $conn->query("
    SELECT
        id, full_name, email, phone, company,
        event_type, event_date, attendees, city,
        message, status,
        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at
    FROM registrations
    ORDER BY created_at DESC
");

if (!$result) {
    echo json_encode(['success' => false, 'message' => 'Query failed: ' . $conn->error]);
    $conn->close();
    exit;
}

$registrations = [];
while ($row = $result->fetch_assoc()) {
    $registrations[] = $row;
}

$conn->close();

echo json_encode([
    'success'       => true,
    'count'         => count($registrations),
    'registrations' => $registrations
]);
?>
