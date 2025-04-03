<?php
// Kết nối với database
$host = 'localhost';
$username = 'root';
$password = '';
$dbname = 'smartride_db';

$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Lấy ID chuyến đi từ query string
$ride_id = isset($_GET['ride_id']) ? (int)$_GET['ride_id'] : 0;

// Lấy vị trí tài xế từ bảng driver_location
$sql = "SELECT dl.latitude, dl.longitude, r.status
        FROM driver_location dl
        INNER JOIN rides r ON dl.driver_id = r.driver_id
        WHERE r.id = $ride_id
        ORDER BY dl.updated_at DESC LIMIT 1";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $driver_location = $result->fetch_assoc();
    echo json_encode([
        'success' => true,
        'latitude' => $driver_location['latitude'],
        'longitude' => $driver_location['longitude'],
        'status' => $driver_location['status']
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Driver location not found.'
    ]);
}

$conn->close();
?>
