<?php
/* ============================================
   LUMINAE EVENTS — REGISTRATION HANDLER
   php/register.php
============================================ */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

// ---- DATABASE CONFIGURATION ----
// !! CHANGE THESE TO YOUR ACTUAL DB CREDENTIALS !!
define('DB_HOST', 'localhost');
define('DB_USER', 'root');        // Your MySQL username
define('DB_PASS', '');            // Your MySQL password
define('DB_NAME', 'luminae_db');  // Database name

// ---- SANITIZE INPUT ----
function sanitize($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

// ---- VALIDATE EMAIL ----
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// ---- VALIDATE PHONE ----
function isValidPhone($phone) {
    return preg_match('/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/', $phone);
}

// ---- ONLY ACCEPT POST ----
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}

// ---- COLLECT & SANITIZE DATA ----
$fullName   = sanitize($_POST['fullName']   ?? '');
$email      = sanitize($_POST['email']      ?? '');
$phone      = sanitize($_POST['phone']      ?? '');
$company    = sanitize($_POST['company']    ?? '');
$eventType  = sanitize($_POST['eventType']  ?? '');
$eventDate  = sanitize($_POST['eventDate']  ?? '');
$attendees  = sanitize($_POST['attendees']  ?? '');
$city       = sanitize($_POST['city']       ?? '');
$message    = sanitize($_POST['message']    ?? '');

// ---- SERVER-SIDE VALIDATION ----
$errors = [];

if (empty($fullName) || strlen($fullName) < 2) {
    $errors[] = 'Full name is required (min 2 characters).';
}
if (empty($email) || !isValidEmail($email)) {
    $errors[] = 'A valid email address is required.';
}
if (empty($phone) || !isValidPhone($phone)) {
    $errors[] = 'A valid phone number is required.';
}
if (empty($eventType)) {
    $errors[] = 'Event type is required.';
}
if (empty($eventDate)) {
    $errors[] = 'Event date is required.';
} elseif (strtotime($eventDate) <= strtotime('today')) {
    $errors[] = 'Event date must be a future date.';
}
if (empty($attendees)) {
    $errors[] = 'Expected attendee count is required.';
}
if (empty($city) || strlen($city) < 2) {
    $errors[] = 'Event city is required.';
}
if (empty($message) || strlen($message) < 20) {
    $errors[] = 'Please describe your event (min 20 characters).';
}
if (strlen($message) > 500) {
    $errors[] = 'Message cannot exceed 500 characters.';
}

if (!empty($errors)) {
    echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
    exit;
}

// ---- CONNECT TO DATABASE ----
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed. Please try again later.']);
    exit;
}

// ---- INSERT RECORD ----
$stmt = $conn->prepare("
    INSERT INTO registrations
        (full_name, email, phone, company, event_type, event_date, attendees, city, message, created_at)
    VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
");

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Query preparation failed: ' . $conn->error]);
    $conn->close();
    exit;
}

$stmt->bind_param(
    'sssssssss',
    $fullName,
    $email,
    $phone,
    $company,
    $eventType,
    $eventDate,
    $attendees,
    $city,
    $message
);

if ($stmt->execute()) {
    $insertId = $stmt->insert_id;
    $stmt->close();
    $conn->close();

    // ---- OPTIONAL: SEND EMAIL NOTIFICATION ----
    // Uncomment below to send a confirmation email (requires mail server)
    /*
    $to      = $email;
    $subject = "Registration Confirmed — Luminae Events";
    $body    = "Dear $fullName,\n\nYour event registration has been received!\n\nEvent Type: $eventType\nDate: $eventDate\nCity: $city\n\nOur team will contact you within 24 hours.\n\nRegards,\nLuminae Events Team";
    $headers = "From: hello@luminaeevents.com";
    mail($to, $subject, $body, $headers);
    */

    echo json_encode([
        'success'    => true,
        'message'    => 'Registration submitted successfully!',
        'registration_id' => $insertId
    ]);
} else {
    $stmt->close();
    $conn->close();
    echo json_encode(['success' => false, 'message' => 'Failed to save registration. Please try again.']);
}
?>
