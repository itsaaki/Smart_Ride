// Global variables
let map
let userMarker; 
let userLatLng; 
let pickupLatLng; 

// List of sample ride requests (pickup/dropoff with coordinates in Hanoi)
const rideRequests = [
  {
    pickup: "Vincom Center Ba Trieu",
    dropoff: "Hoan Kiem Lake",
    coords: { lat: 21.0145, lng: 105.8492 }
  },
  {
    pickup: "Hanoi Railway Station",
    dropoff: "Keangnam Landmark Tower",
    coords: { lat: 21.0245, lng: 105.8419 }
  },
  {
    pickup: "Indochina Plaza Hanoi",
    dropoff: "West Lake",
    coords: { lat: 21.0376, lng: 105.7847 }
  },
  {
    pickup: "Royal City Vincom Mega Mall",
    dropoff: "Long Bien Bridge",
    coords: { lat: 21.0032, lng: 105.8162 }
  }
];

function initMap() {
  // Check if the browser supports geolocation and Request user's location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        userLatLng = [lat, lng]; // Save user position

        // Create the Leaflet map and center it on user's location
        map = L.map('map').setView(userLatLng, 15);

        // Add OpenStreetMap tile layer (colorful street map)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; Stadia Maps, OpenMapTiles'
        }).addTo(map);

        // Add a marker for user's location
        userMarker = L.marker(userLatLng).addTo(map)
          .bindPopup("You are here")
          .openPopup();

        // Use Nominatim to reverse-geocode the user's address
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
          .then(res => res.json())
          .then(data => {
            const address = data.display_name || "Address not found.";
            document.getElementById("address").textContent = address;
            console.log("Address:", address);
          })
          .catch(err => {
            document.getElementById("address").textContent = "Unable to fetch address.";
            console.error("Geocode error:", err);
          });
      },
      // If location fails or is denied
      error => {
        console.error("Geolocation error:", error);
        document.getElementById("address").textContent = "Geolocation failed.";
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  } else {
    // If browser does not support geolocation
    document.getElementById("address").textContent = "Geolocation not supported.";
  }
}

// Displays a random ride request on the screen
function showRideRequest() {
  const ride = rideRequests[Math.floor(Math.random() * rideRequests.length)]; // Pick random ride
  pickupLatLng = [ride.coords.lat, ride.coords.lng]; // Save pickup coordinates

  // Show ride info in HTML
  document.getElementById("ride-details").innerHTML = `
    <p><strong>Pickup:</strong> ${ride.pickup}</p>
    <p><strong>Dropoff:</strong> ${ride.dropoff}</p>
    <p>Do you want to accept this ride?</p>
  `;

  // Show ride box and clear any old response message
  document.getElementById("ride-box").style.display = "block";
  document.getElementById("ride-response").textContent = "";
}

// Called when the user accepts the ride
function acceptRide() {
  // Hide the ride offer UI
  document.getElementById("ride-box").style.display = "none";

  drawRouteToPickup();
}

// Called when the user rejects the ride
function rejectRide() {
  document.getElementById("ride-response").textContent = "Ride rejected. Searching for a new request...";  
  setTimeout(showRideRequest, 1500);
}

// Adds a pickup marker and requests a driving route using ORS
function drawRouteToPickup() {
  if (!userLatLng || !pickupLatLng) return;

  // Place a marker at the pickup point
  const pickupMarker = L.marker(pickupLatLng).addTo(map)
    .bindPopup("Pickup Location")
    .openPopup();

  // Draw route from user to pickup
  drawORSRoute(userLatLng, pickupLatLng);
}

// Uses OpenRouteService API to draw a driving route on the map
function drawORSRoute(fromLatLng, toLatLng) {
  const orsApiKey = "5b3ce3597851110001cf6248f87be8e9897f4a1fa44433970de7f58e";

  const url = "https://api.openrouteservice.org/v2/directions/driving-car/geojson";

  const body = {
    coordinates: [
      [fromLatLng[1], fromLatLng[0]], // ORS uses [lng, lat]
      [toLatLng[1], toLatLng[0]]
    ]
  };

  fetch(url, {
    method: "POST",
    headers: {
      "Authorization": orsApiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })
    .then(response => response.json())
    .then(data => {
      // Draw the route line using GeoJSON
      const route = L.geoJSON(data, {
        style: {
          color: "green",
          weight: 4,
          opacity: 0.8
        }
      }).addTo(map);

      // Fit map view to route
      map.fitBounds(route.getBounds(), { padding: [50, 50] });
    })
    .catch(error => {
      console.error("ORS routing error:", error);
    });
}

// Run this once the page loads
window.onload = () => {
  initMap(); // Start geolocation + map
  setTimeout(showRideRequest, 1000); // Wait a bit before showing a ride
};
