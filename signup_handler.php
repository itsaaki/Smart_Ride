<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

$db_host = 'localhost';
$db_name = 'smartride_db';
$db_user = 'root';
$db_pass = '';

$response = ['success' => false, 'message' => 'Signup failed.'];

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['username'], $input['email'], $input['password'], $input['user_type'])) {
    $response['message'] = 'Missing required fields.';
    echo json_encode($response);
    exit;
}

$username = trim($input['username']);
$email = trim($input['email']);
$password = $input['password'];
$user_type = trim($input['user_type']);

if ($username === '' || $email === '' || $password === '' || $user_type === '') {
    $response['message'] = 'All fields are required.';
    echo json_encode($response);
    exit;
}

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);

    // Check username
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = :username");
    $stmt->execute(['username' => $username]);
    if ($stmt->fetch()) {
        $response['message'] = 'Username already exists.';
        echo json_encode($response);
        exit;
    }

    // Hash and store
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password, user_type) VALUES (:username, :email, :password, :user_type)");
    $stmt->execute([
        'username' => $username,
        'email' => $email,
        'password' => $hashedPassword,
        'user_type' => $user_type
    ]);

    $response['success'] = true;
    $response['message'] = 'Signup successful!';

} catch (PDOException $e) {
    $response['message'] = 'Database error: ' . $e->getMessage();
}

echo json_encode($response);
exit;
