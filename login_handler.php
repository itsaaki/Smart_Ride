<?php
// Enable error reporting (disable in production)
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

// --- Database Configuration ---
$db_host = 'localhost';
$db_name = 'smartride_db';
$db_user = 'root';
$db_pass = '';

$response = ['success' => false, 'message' => 'Login failed.'];

// --- Get JSON input from JavaScript ---
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['username'], $input['password'])) {
    $response['message'] = 'Missing username or password.';
    echo json_encode($response);
    exit;
}

$username = trim($input['username']);
$password = $input['password'];

if ($username === '' || $password === '') {
    $response['message'] = 'Username and password cannot be empty.';
    echo json_encode($response);
    exit;
}

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);

    $stmt = $pdo->prepare("SELECT id, username, password, user_type FROM users WHERE username = :username LIMIT 1");
    $stmt->execute(['username' => $username]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        echo json_encode([
            'success' => true,
            'userType' => $user['user_type']
        ]);
        exit;
    } else {
        $response['message'] = 'Invalid username or password.';
        echo json_encode($response);
        exit;
    }

} catch (PDOException $e) {
    $response['message'] = 'Database connection failed: ' . $e->getMessage();
    echo json_encode($response);
    exit;
}
