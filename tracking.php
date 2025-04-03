<?php
// Cấu hình kết nối database
$host = 'localhost';
$username = 'root';
$password = '';
$dbname = 'smartride_db';

$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Lấy ID chuyến đi từ URL hoặc session
$ride_id = 1; // Cần thay bằng ID động

// Lấy thông tin chuyến đi
$sql = "SELECT r.*, u.username AS driver_name, u.email AS driver_email
        FROM rides r
        INNER JOIN users u ON r.driver_id = u.id
        WHERE r.id = $ride_id";
$result = $conn->query($sql);
$ride = $result->fetch_assoc();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tracking Your Ride</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <link rel="stylesheet" href="css/tracking.css">
</head>
<body>
    <header>Tracking Your Ride</header>
    <div class="container">
        <div id="map" class="map"></div>
        <div id="status">Waiting for the driver to arrive...</div>
    </div>

    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script src="js/tracking.js"></script>

    <script>
        var rideId = <?php echo $ride_id; ?>;
    </script>
</body>
</html>
