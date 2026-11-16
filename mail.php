<?php
// Baffoe Kwabena Studio Portfolio - Contact Form Handler
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $to = "baffoekwabena.art@gmail.com";
    $subject = "New Inquiry from Portfolio Website";

    $name = isset($_POST['Name']) ? trim(strip_tags($_POST['Name'])) : (isset($_POST['name']) ? trim(strip_tags($_POST['name'])) : 'Unknown');
    $email = isset($_POST['E-mail']) ? trim(strip_tags($_POST['E-mail'])) : (isset($_POST['email']) ? trim(strip_tags($_POST['email'])) : 'No Email');
    $phone = isset($_POST['Phone']) ? trim(strip_tags($_POST['Phone'])) : (isset($_POST['phone']) ? trim(strip_tags($_POST['phone'])) : 'Not Provided');
    $message = isset($_POST['Message']) ? trim(strip_tags($_POST['Message'])) : (isset($_POST['message']) ? trim(strip_tags($_POST['message'])) : '');

    $body = "New Inquiry for Baffoe Kwabena Studio:\n\n";
    $body .= "Name: " . $name . "\n";
    $body .= "Email: " . $email . "\n";
    $body .= "Phone: " . $phone . "\n";
    $body .= "Message:\n" . $message . "\n";

    $headers = "From: " . $email . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    @mail($to, $subject, $body, $headers);

    echo json_encode(["status" => "success", "message" => "Message sent successfully."]);
    exit;
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
    exit;
}
?>
