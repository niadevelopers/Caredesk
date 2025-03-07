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
      window.location.href = 'admin&id=67caf4bf-a60c-8008-9e8f-4b5bf502b3265450158,3523googledisplayjs?client=crossorigin.html';
    } else {
      alert(result.error);
    }
  } catch (err) {
    console.error('Error logging in:', err.message);
    alert('An error occurred. Please try again.');
  }
});
