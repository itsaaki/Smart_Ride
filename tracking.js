// Khởi tạo bản đồ OSM
var map = L.map('map').setView([10.7769, 106.7009], 13);

// Load tile từ OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Icon marker
var pickupIcon = L.icon({
    iconUrl: 'https://img.icons8.com/ios-filled/50/0000FF/marker.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
});

var dropoffIcon = L.icon({
    iconUrl: 'https://img.icons8.com/ios-filled/50/FF0000/marker.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
});

var driverIcon = L.icon({
    iconUrl: 'https://img.icons8.com/ios-filled/50/000000/car.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
});

// Tọa độ điểm đón và trả
var pickupCoords = [10.7769, 106.7009];
var dropoffCoords = [10.762622, 106.660172];

// Tạo marker
L.marker(pickupCoords, {icon: pickupIcon}).addTo(map).bindPopup("Pickup Location");
L.marker(dropoffCoords, {icon: dropoffIcon}).addTo(map).bindPopup("Dropoff Location");

// Marker tài xế (sẽ cập nhật)
var driverMarker = L.marker([10.7700, 106.6950], {icon: driverIcon}).addTo(map);

// Layer để hiển thị tuyến đường
var routeLayer;

// Lấy đường đi thực tế từ OpenRouteService
function getRoute() {
    var routeUrl = `https://router.project-osrm.org/route/v1/driving/${pickupCoords[1]},${pickupCoords[0]};${dropoffCoords[1]},${dropoffCoords[0]}?overview=full&geometries=geojson`;

    fetch(routeUrl)
        .then(response => response.json())
        .then(data => {
            var routeCoords = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
            
            if (routeLayer) {
                map.removeLayer(routeLayer);
            }

            routeLayer = L.polyline(routeCoords, { color: 'blue', weight: 5 }).addTo(map);
        })
        .catch(error => console.error("Error fetching route:", error));
}

// Gọi API để lấy tuyến đường
getRoute();

// Cập nhật vị trí tài xế
function updateDriverLocation() {
    fetch(`get_driver_location.php?ride_id=${rideId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                var lat = data.latitude;
                var lng = data.longitude;

                // Cập nhật vị trí tài xế trên bản đồ
                driverMarker.setLatLng([lat, lng]);
                driverMarker.setPopupContent("Driver Location: " + lat + ", " + lng).openPopup();

                // Cập nhật trạng thái
                var statusElement = document.getElementById("status");
                if (data.status === 'arrived') {
                    statusElement.innerText = "Driver has arrived!";
                } else if (data.status === 'ongoing') {
                    statusElement.innerText = "Your ride is in progress!";
                } else if (data.status === 'completed') {
                    statusElement.innerText = "Ride completed!";
                }
            }
        })
        .catch(error => console.error("Error fetching driver location:", error));
}

// Cập nhật vị trí mỗi 5 giây
setInterval(updateDriverLocation, 5000);
