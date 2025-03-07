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
      window.location.href = 'encrypted_admin_ui-v2_4d12f3b90008-ab00-43a0-bd23-2345b678a905-data-visualization-and-user-role-mgmt--2023.html';
    } else {
      alert(result.error);
    }
  } catch (err) {
    console.error('Error logging in:', err.message);
    alert('An error occurred. Please try again.');
  }
});
