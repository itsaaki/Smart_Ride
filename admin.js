

document.addEventListener('DOMContentLoaded', () => {
    fetchRideHistory();
});

function fetchRideHistory() {
    const rideHistoryTableBody = document.getElementById('ride-history-table-body');
    const apiUrl = '/api/admin/rides'; // <-- IMPORTANT: Replace with your ACTUAL backend endpoint for fetching all rides

    // Clear previous content and show loading state
    rideHistoryTableBody.innerHTML = '<tr><td colspan="11" style="text-align: center;">Loading ride data...</td></tr>';

    // --- Authentication ---
    // In a real application, you'd retrieve an auth token (e.g., from localStorage)
    // and send it in the headers. Example:
    // const token = localStorage.getItem('adminAuthToken');
    // if (!token) {
    //     rideHistoryTableBody.innerHTML = '<tr><td colspan="11" style="text-align: center; color: red;">Error: Admin not authenticated. Redirecting to login...</td></tr>';
    //     // Optional: Redirect after a delay
    //     // setTimeout(() => { window.location.href = 'login.html'; }, 3000);
    //     return; // Stop fetching if not authenticated
    // }

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            // --- Add Authorization header ---
            // 'Authorization': `Bearer ${token}` // Uncomment and use if you have token auth
        }
    })
    .then(response => {
        if (!response.ok) {
            // Try to get error message from backend response body
            return response.json().then(errData => {
                throw new Error(errData.message || `HTTP error! Status: ${response.status}`);
            }).catch(() => {
                // Fallback if response body isn't JSON or doesn't have message
                throw new Error(`HTTP error! Status: ${response.status}`);
            });
        }
        return response.json(); // Parse successful response as JSON
    })
    .then(data => {
        // Assuming the API returns an object with a 'rides' array: { success: true, rides: [...] }
        // Adjust this based on your actual API response structure
        if (data && data.success && Array.isArray(data.rides)) {
            populateRideTable(data.rides);
        } else {
             // Handle cases where response is successful but data format is wrong
             console.error("API response format incorrect:", data);
             throw new Error("Received invalid data format from server.");
        }
    })
    .catch(error => {
        console.error('Error fetching ride history:', error);
        rideHistoryTableBody.innerHTML = `<tr><td colspan="11" style="text-align: center; color: red;">Failed to load ride data: ${error.message}</td></tr>`;
    });
}

function populateRideTable(rides) {
    const rideHistoryTableBody = document.getElementById('ride-history-table-body');

    // Clear loading message or previous data
    rideHistoryTableBody.innerHTML = '';

    if (rides.length === 0) {
        rideHistoryTableBody.innerHTML = '<tr><td colspan="11" style="text-align: center;">No ride history found.</td></tr>';
        return;
    }

    rides.forEach(ride => {
        const row = document.createElement('tr');

        // --- IMPORTANT: Adjust property names (e.g., ride.rideId, ride.userName) ---
        // --- to match EXACTLY what your backend API sends for each ride object. ---

        // 1. Ride ID
        const cellId = document.createElement('td');
        cellId.textContent = ride.id || 'N/A'; // Example: ride.id or ride.ride_id
        row.appendChild(cellId);

        // 2. User
        const cellUser = document.createElement('td');
        cellUser.textContent = ride.userName || ride.userId || 'N/A'; // Example: ride.userName or ride.user_email
        row.appendChild(cellUser);

        // 3. Driver
        const cellDriver = document.createElement('td');
        cellDriver.textContent = ride.driverName || ride.driverId || 'N/A'; // Example: ride.driverName or 'Unassigned'
        row.appendChild(cellDriver);

        // 4. Pickup
        const cellPickup = document.createElement('td');
        // Assume pickup is an object { address: '...' } or just a string
        cellPickup.textContent = typeof ride.pickup === 'object' ? ride.pickup.address : ride.pickup || 'N/A';
        cellPickup.title = typeof ride.pickup === 'object' ? `Lat: ${ride.pickup.lat}, Lng: ${ride.pickup.lng}` : ride.pickup || ''; // Tooltip for coords if available
        row.appendChild(cellPickup);

        // 5. Dropoff
        const cellDropoff = document.createElement('td');
        cellDropoff.textContent = typeof ride.dropoff === 'object' ? ride.dropoff.address : ride.dropoff || 'N/A';
        cellDropoff.title = typeof ride.dropoff === 'object' ? `Lat: ${ride.dropoff.lat}, Lng: ${ride.dropoff.lng}` : ride.dropoff || ''; // Tooltip
        row.appendChild(cellDropoff);

        // 6. Vehicle
        const cellVehicle = document.createElement('td');
        cellVehicle.textContent = ride.vehicleType || 'N/A'; // e.g., 'Bike', 'Car (4 seats)'
        row.appendChild(cellVehicle);

        // 7. Distance
        const cellDistance = document.createElement('td');
        cellDistance.textContent = ride.distance ? `${ride.distance.toFixed(2)}` : '-'; // Format to 2 decimal places
        cellDistance.style.textAlign = 'right'; // Align numbers right
        row.appendChild(cellDistance);

        // 8. Fare
        const cellFare = document.createElement('td');
        // Format currency (basic VND example)
        cellFare.textContent = typeof ride.fare === 'number' ? ride.fare.toLocaleString('vi-VN') : '-';
        cellFare.style.textAlign = 'right'; // Align numbers right
        row.appendChild(cellFare);

        // 9. Booked At
        const cellBookedAt = document.createElement('td');
        try {
            cellBookedAt.textContent = ride.bookedAt ? new Date(ride.bookedAt).toLocaleString() : 'N/A'; // Format date/time
        } catch (e) {
            cellBookedAt.textContent = ride.bookedAt || 'Invalid Date'; // Fallback if date parsing fails
        }
        row.appendChild(cellBookedAt);

        // 10. Status
        const cellStatus = document.createElement('td');
        const statusText = ride.status || 'Unknown';
        cellStatus.textContent = statusText;
        // Apply status class (convert status text to lowercase for class name)
        cellStatus.className = `status-${statusText.toLowerCase().replace(/\s+/g, '-')}`; // e.g., status-in-progress
        row.appendChild(cellStatus);

        // 11. Payment Method
        const cellPayment = document.createElement('td');
        cellPayment.textContent = ride.paymentMethod || 'N/A';
        row.appendChild(cellPayment);

        // Append the completed row to the table body
        rideHistoryTableBody.appendChild(row);
    });
}
