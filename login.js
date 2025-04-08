// In login.js

document.getElementById('loginForm').addEventListener('submit', function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get username and password values from the form
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // --- Backend Interaction ---
    // Define the backend PHP script URL
    const loginApiUrl = 'login_handler.php'; // <-- POINT TO YOUR PHP SCRIPT

    // Prepare the data to send to the backend
    const loginData = {
        username: username,
        password: password
    };

    // Use the fetch API to send the data
    fetch(loginApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Add 'Accept' header if your PHP script strictly checks it
            // 'Accept': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        // Try to parse JSON regardless of status code first for better error handling
        return response.json().then(data => ({ ok: response.ok, status: response.status, data }));
    })
    .then(result => {
        const { ok, status, data } = result;

        if (!ok) {
            // Handle HTTP errors (e.g., 404 Not Found, 500 Server Error)
            // Use the message from the parsed JSON if available, otherwise use status
            throw new Error(data?.message || `HTTP error! Status: ${status}`);
        }

        // --- Process Successful Login Response (from PHP) ---
        // Expected format from PHP: { "success": true, "userType": "user" } or { "success": false, "message": "..." }

        if (data.success) {
            if (data.userType === 'user') {
                alert('User login successful! Redirecting...');
                window.location.href = 'user.html';
            } else if (data.userType === 'driver') {
                alert('Driver login successful! Redirecting...');
                window.location.href = 'driver.html'; // Ensure this page exists
            } else if (data.userType === 'admin') {
                alert('admin login successful! Redirecting...');
                window.location.href = 'admin.html'; {
            }
            } else {
                alert('Login successful, but user type is unknown. Please contact support.');
                console.error("Unknown userType received:", data.userType);
            }
        } else {
            // Handle login failure indicated by PHP (e.g., wrong password)
            alert(`Login failed: ${data.message || 'Invalid credentials.'}`);
        }
    })
    .catch(error => {
        // --- Handle Network Errors or Errors During Fetch/Parsing ---
        console.error('Login Error:', error);
        // Check if it's a JSON parsing error (often means PHP outputted something unexpected)
        if (error instanceof SyntaxError) {
             alert('An error occurred communicating with the server. Invalid response format.');
        } else {
             alert(`An error occurred during login: ${error.message}. Please try again later.`);
        }
    });
});