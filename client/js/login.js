const loginForm = document.getElementById('login-form');
const loader = document.createElement('div'); // Create a loader element
loader.textContent = "Loading..."; // Message for the loader
loader.style.position = 'fixed'; // Make loader fixed position
loader.style.top = '50%'; // Center vertically
loader.style.left = '50%'; // Center horizontally
loader.style.transform = 'translate(-50%, -50%)'; // Adjust for centering
loader.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Semi-transparent background
loader.style.color = 'white'; // White text color
loader.style.padding = '20px'; // Padding for aesthetics
loader.style.borderRadius = '5px'; // Rounded corners
loader.style.display = 'none'; // Initially hidden

document.body.appendChild(loader); // Add loader to body

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Show loader
    loader.style.display = 'block';

    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();
        
        // Hide loader after response is received
        loader.style.display = 'none';

        if (response.ok) {
            alert(result.message);
            // Store the token and role in localStorage
            localStorage.setItem('token', result.token);
            const tokenPayload = JSON.parse(atob(result.token.split('.')[1])); // Decode JWT payload
            localStorage.setItem('role', tokenPayload.role);
            
            // Redirect based on role
            if (tokenPayload.role === 'chief') {
                window.location.href = 'encrypted_admin_ui-v2_4d12f3b90008-ab00-43a0-bd23-2345b678a905-data-visualization-and-user-role-mgmt--2023.html'; // Chief Admin Full Dashboard
            } else {
                window.location.href = 'junior-dashboard.html'; // Junior Admin Limited Dashboard
            }
        } else {
            alert(result.error);
        }
    } catch (err) {
        console.error('Error logging in:', err.message);
        alert('An error occurred. Please try again.');
        // Hide loader in case of error
        loader.style.display = 'none';
    }
});
