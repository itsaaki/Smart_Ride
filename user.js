let map;
let pickupMarker, dropoffMarker, routeLine;

const orsApiKey = "5b3ce3597851110001cf6248f87be8e9897f4a1fa44433970de7f58e";

function initMap() {
  map = L.map("map").setView([21.0285, 105.8542], 13); // Hanoi center

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);
}

function setupAddressInput(inputId, isPickup) {
  const input = document.getElementById(inputId);
  input.addEventListener("input", function () {
    const query = input.value.trim();
    if (query.length < 3) return;

    fetch(
      `https://api.openrouteservice.org/geocode/autocomplete?api_key=${orsApiKey}&text=${query}&boundary.country=VN`
    )
      .then((res) => res.json())
      .then((data) => {
        const list = document.getElementById(inputId + "-suggestions");
        if (list) {
          list.innerHTML = "";
          data.features.forEach((feature) => {
            const option = document.createElement("div");
            option.classList.add("suggestion-item");
            option.textContent = feature.properties.label;
            option.addEventListener("click", () => {
              input.value = feature.properties.label;
              list.innerHTML = "";
              setAddress(feature.geometry.coordinates.reverse(), isPickup);
            });
            list.appendChild(option);
          });
        }
      });
  });
}

function suggestAddress(inputId, resultId) {
  const input = document.getElementById(inputId);
  const resultDiv = document.getElementById(resultId);

  if (!resultDiv) {
    console.error(`Element with ID '${resultId}' not found`);
    return;  // Exit the function if the result container does not exist
  }

  input.addEventListener("input", function () {
    const query = input.value.trim();
    if (query.length < 3) {
      resultDiv.innerHTML = "";  // Clear previous results
      return;
    }

    fetch(
      `https://api.openrouteservice.org/geocode/autocomplete?api_key=${orsApiKey}&text=${query}&boundary.country=VN`
    )
      .then((res) => res.json())
      .then((data) => {
        resultDiv.innerHTML = "";
        data.features.forEach((feature) => {
          const option = document.createElement("div");
          option.classList.add("autocomplete-item");
          option.textContent = feature.properties.label;
          option.addEventListener("click", () => {
            input.value = feature.properties.label;
            resultDiv.innerHTML = "";  // Clear the suggestions after selection
            setAddress(feature.geometry.coordinates.reverse(), inputId === "pickup");
          });
          resultDiv.appendChild(option);
        });
      })
      .catch((err) => console.error("Error fetching address suggestions:", err));
  });
}

function setAddress(latlng, isPickup) {
  if (isPickup) {
    if (pickupMarker) map.removeLayer(pickupMarker);
    pickupMarker = L.marker(latlng).addTo(map).bindPopup("Pickup").openPopup();
  } else {
    if (dropoffMarker) map.removeLayer(dropoffMarker);
    dropoffMarker = L.marker(latlng).addTo(map).bindPopup("Drop-off").openPopup();
  }

  if (pickupMarker && dropoffMarker) {
    calculateRoute();
  }
}

function calculateRoute() {
  const pickup = pickupMarker.getLatLng();
  const dropoff = dropoffMarker.getLatLng();

  const url = "https://api.openrouteservice.org/v2/directions/driving-car/geojson";

  const body = {
    coordinates: [
      [pickup.lng, pickup.lat],
      [dropoff.lng, dropoff.lat]
    ]
  };

  fetch(url, {
    method: "POST",
    headers: {
      Authorization: orsApiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })
    .then((res) => res.json())
    .then((data) => {
      const route = data.features[0];

      if (routeLine) map.removeLayer(routeLine);

      const geojsonFeature = {
        type: "Feature",
        geometry: route.geometry,
        properties: {}
      };

      routeLine = L.geoJSON(geojsonFeature, {
        style: {
          color: "green",
          weight: 4,
          opacity: 0.8
        }
      }).addTo(map);

      map.fitBounds(routeLine.getBounds(), { padding: [20, 20] });

      const summary = route.properties.summary;
      const distance = summary.distance / 1000; // in km
      const duration = summary.duration / 60; // in minutes

      const fare = Math.max(15000, 10000 + distance * 5000); // basic fare formula

      document.getElementById("distanceValue").textContent = distance.toFixed(2) + " km";
      document.getElementById("durationValue").textContent = duration.toFixed(1) + " min";
      document.getElementById("fareValue").textContent = fare.toLocaleString() + " VND";

      // Display the route guide (steps)
      displayRouteGuide(route);
    })
    .catch((error) => {
      console.error("ORS routing error:", error);
      alert("Failed to calculate route. Please try again.");
    });
}

function displayRouteGuide(route) {
  const routeGuide = route.properties.segments[0].steps;
  const routeContainer = document.getElementById("route-steps");
  routeContainer.innerHTML = '';  // Clear existing route guide

  routeGuide.forEach((step, index) => {
    const stepElement = document.createElement("div");
    stepElement.textContent = `${index + 1}. ${step.instruction}`;
    routeContainer.appendChild(stepElement);
  });
}

// Define the bookRide function
function bookRide() {
  const pickup = document.getElementById("pickup").value;
  const dropoff = document.getElementById("dropoff").value;
  const distance = document.getElementById("distanceValue").textContent;
  const duration = document.getElementById("durationValue").textContent;
  const fare = document.getElementById("fareValue").textContent;

  // Handle booking logic (for now, just log the details)
  console.log(`Booking details:
    Pickup: ${pickup}
    Dropoff: ${dropoff}
    Distance: ${distance}
    Duration: ${duration}
    Fare: ${fare}`);

  alert(`Booking confirmed for ${pickup} to ${dropoff}.\nTotal: ${fare}`);
}

window.onload = () => {
  initMap();
  setupAddressInput("pickup", true);
  setupAddressInput("dropoff", false);
  suggestAddress("pickup", "pickup-results");
  suggestAddress("dropoff", "dropoff-results");
};
