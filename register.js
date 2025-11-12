document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('register-form');
  const usernameInput = document.getElementById('reg-username');
  const passwordInput = document.getElementById('reg-password');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = (usernameInput?.value || '').trim();
    const password = passwordInput?.value || '';

    if (!username || !password) {
      alert('Please enter username and password.');
      return;
    }

    // Get existing users from localStorage
    let users = [];
    try {
      const stored = localStorage.getItem('winaBwanguUsers');
      users = stored ? JSON.parse(stored) : [];
    } catch (e) {
      users = [];
    }

    // Check if username already exists
    if (users.find(u => u.username === username)) {
      alert('Username already exists. Please choose a different username.');
      return;
    }

    // Add new user (in production, password should be hashed)
    users.push({ username, password });
    
    try {
      localStorage.setItem('winaBwanguUsers', JSON.stringify(users));
      alert('Account created successfully! You can now log in.');
      window.location.href = 'index.html';
    } catch (err) {
      alert('Failed to create account. Please try again.');
    }
  });
});
