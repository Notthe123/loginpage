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

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        alert(data.message || 'Registration failed');
        return;
      }
      alert('Account created. You can now log in.');
      window.location.href = 'login-page.html';
    } catch (err) {
      alert('Network error. Please try again.');
    }
  });
});
