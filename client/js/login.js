const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message);

      // Store the token and role in localStorage
      localStorage.setItem('token', result.token);

      // Decode token to get role
      const tokenPayload = JSON.parse(atob(result.token.split('.')[1])); // Decode JWT payload
      localStorage.setItem('role', tokenPayload.role);

      // Redirect based on role
      if (tokenPayload.role === 'chief') {
        window.location.href = ''; // Chief Admin Full Dashboard
      } else {
        window.location.href = 'junior-dashboard.html'; // Junior Admin Limited Dashboard
      }
    } else {
      alert(result.error);
    }
  } catch (err) {
    console.error('Error logging in:', err.message);
    alert('An error occurred. Please try again.');
  }
});
