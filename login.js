document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const rememberInput = document.getElementById('remember');

  if (!form) return;

  try {
    const remembered = localStorage.getItem('rememberedUser');
    if (remembered) {
      usernameInput.value = remembered;
      if (rememberInput) rememberInput.checked = true;
    }
  } catch (e) {
    
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = (usernameInput?.value || '').trim();
    const password = passwordInput?.value || '';

    if (!username || !password) {
      alert('Please enter username and password.');
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        alert(data.message || 'Invalid username or password. Please check or create an account.');
        return;
      }
    } catch (err) {
      alert('Network error. Please try again.');
      return;
    }

    try {
      if (rememberInput?.checked) {
        localStorage.setItem('rememberedUser', username);
      } else {
        localStorage.removeItem('rememberedUser');
      }
    } catch (e) {
      
    }

    window.location.href = 'Wina-bwangu.html';
  });
});
