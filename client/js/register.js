const registerForm = document.getElementById('register-form');

// Create a style element for the loader CSS
const style = document.createElement('style');
style.textContent = `
.loader {
    display: none; /* Start hidden */
    justify-content: center; /* Center the dots horizontally */
    align-items: center; /* Center the dots vertically */
    position: fixed; /* Keep loader in view */
    top: 50%; /* Center vertically */
    left: 50%; /* Center horizontally */
    transform: translate(-50%, -50%); /* Adjust for centering */
    z-index: 9999; /* Keep on top of other content */
    background-color: rgba(0, 0, 0, 0.8); /* Dark background for contrast */
    padding: 20px; /* Add padding */
    border-radius: 10px; /* Rounded corners */
}

.dot {
    width: 12px; /* Initial size of dots */
    height: 12px;
    border-radius: 50%; /* Make dots circular */
    margin: 0 5px; /* Horizontal space between dots */
    animation: dot-blink 1.5s infinite; /* Apply blinking animation */
}

/* Dot colors */
.dot:nth-child(1) {
    background-color: rgba(255, 255, 128, 0.5); /* Faint yellow */
}

.dot:nth-child(2) {
    background-color: rgba(255, 255, 0, 0.75); /* Bright yellow */
}

.dot:nth-child(3) {
    background-color: rgba(255, 204, 0, 1); /* Deep yellow */
}

/* Dot blinking animation */
@keyframes dot-blink {
    0%, 80%, 100% {
        transform: scale(0.5); /* Scale down initially */
        opacity: 0.5; /* Decrease opacity */
    }
    20% {
        transform: scale(1.2); /* Scale up */
        opacity: 1; /* Full opacity */
    }
}

.dot:nth-child(1) {
    animation-delay: 0s; /* First dot - no delay */
}

.dot:nth-child(2) {
    animation-delay: 0.2s; /* Second dot - delay */
}

.dot:nth-child(3) {
    animation-delay: 0.4s; /* Third dot - delay */
}
`;
document.head.appendChild(style); // Append style element to head

const loader = document.createElement('div'); // Create loader container
loader.className = 'loader'; // Set class for styling

// Create individual dot elements
for (let i = 0; i < 3; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    loader.appendChild(dot); // Add each dot to the loader
}

document.body.appendChild(loader); // Add loader to body

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Show loader
    loader.style.display = 'flex';

    try {
        // Check if a Chief Admin already exists
        const checkChiefResponse = await fetch('/api/admin/check-chief');
        const { chiefExists } = await checkChiefResponse.json();
        const role = chiefExists ? 'junior' : 'chief'; // First admin = Chief, others = Junior

        const response = await fetch('/api/admin/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role }),
        });

        const result = await response.json();

        // Hide loader after response is received
        loader.style.display = 'none';

        if (response.ok) {
            alert(result.message);
            window.location.href = 'admin-login.html';
        } else {
            alert(result.error);
        }
    } catch (err) {
        console.error('Error registering admin:', err.message);
        alert('An error occurred. Please try again.');
        // Hide loader in case of error
        loader.style.display = 'none';
    }
});
