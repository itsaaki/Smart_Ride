// forgot_password.js
document.getElementById('forgotPasswordForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const submitButton = this.querySelector('button[type="submit"]'); // Get the button

    // Optional: Disable button while processing
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    const forgotApiUrl = 'forgot_password_handler.php'; // Point to your PHP handler

    fetch(forgotApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email })
    })
    .then(response => response.json().then(data => ({ ok: response.ok, status: response.status, data })))
    .then(result => {
        const { ok, status, data } = result;

        // IMPORTANT: Always show a generic message for security reasons,
        // regardless of whether the email was found or not.
        alert(data?.message || "If an account exists for this email, a password reset link has been sent.");

        // Redirect back to login or clear form, depending on preference
         window.location.href = 'login.html'; // Example: redirect back
        // Or just re-enable the button:
        // submitButton.disabled = false;
        // submitButton.textContent = 'Send Reset Link';
        // document.getElementById('email').value = ''; // Clear input
    })
    .catch(error => {
        console.error('Forgot Password Error:', error);
        alert("An error occurred while trying to send the reset link. Please try again later.");
         // Re-enable button on error
        submitButton.disabled = false;
        submitButton.textContent = 'Send Reset Link';
    });
});