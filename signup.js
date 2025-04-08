// signup.js
document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;
    const userTypeInput = document.querySelector('input[name="user_type"]:checked');
    if (!userTypeInput) {
        alert("Please select an account type.");
        return;
    }
    const accountType = userTypeInput.value;
    
    // --- Frontend Validation ---
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return; // Stop submission
    }

    if (password.length < 8) {
         alert("Password must be at least 8 characters long.");
         return;
    }

    // --- Prepare Data for Backend ---
    const signupData = {
        username: username,
        email: email,
        password: password, // Send plain password, backend will hash
        user_type: accountType
    };

    // --- Send Data to Backend ---
    const signupApiUrl = 'signup_handler.php'; // Point to your PHP handler

    fetch(signupApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData)
    })
    .then(response => response.json().then(data => ({ ok: response.ok, status: response.status, data })))
    .then(result => {
        const { ok, status, data } = result;

        if (!ok) {
             throw new Error(data?.message || `HTTP error! Status: ${status}`);
        }

        if (data.success) {
            alert(data.message || 'Signup successful! Please log in.');
            window.location.href = 'login.html'; // Redirect to login page
        } else {
            // Show error message from backend (e.g., username taken)
            alert(`Signup failed: ${data.message || 'An unknown error occurred.'}`);
        }
    })
    .catch(error => {
        console.error('Signup Error:', error);
         if (error instanceof SyntaxError) {
             alert('An error occurred communicating with the server. Invalid response format.');
        } else {
             alert(`An error occurred during signup: ${error.message}. Please try again later.`);
        }
    });
});