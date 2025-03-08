document.addEventListener('DOMContentLoaded', () => {
    const role = localStorage.getItem('role'); // Get stored role from login
    const adminRoleText = document.getElementById('admin-role');
  
    // 🔹 If no role is found, force login
    if (!role) {
      alert('Unauthorized access! Please log in.');
      window.location.href = 'admin-login.html';
      return;
    }
  
    // 🔹 Display the admin role
    adminRoleText.textContent = role === 'chief' ? 'Chief' : 'Junior';
  
    // 🔹 Restrict Junior Admins
    if (role === 'junior') {
      alert('You have limited access. Editing and deleting blogs are restricted.');
  
      // Disable edit and delete buttons
      document.querySelectorAll('.edit-btn, .delete-btn').forEach(button => {
        button.disabled = true;
        button.onclick = () => alert('Only the Chief Admin can perform this action!');
      });
    }
  });
  
