const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/api/admin/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (response.ok) {
      alert(result.message);
      window.location.href = 'admin-login.html';
    } else {
      alert(result.error);
    }
  } catch (err) {
    console.error('Error registering admin:', err.message);
    alert('An error occurred. Please try again.');
  }
});
