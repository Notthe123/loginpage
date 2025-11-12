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

    // Get users from localStorage
    let users = [];
    try {
      const stored = localStorage.getItem('winaBwanguUsers');
      users = stored ? JSON.parse(stored) : [];
    } catch (e) {
      users = [];
    }

    // Validate credentials
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
      alert('Invalid username or password. Please check or create an account.');
      return;
    }

    // Store current user session
    try {
      localStorage.setItem('winaBwanguCurrentUser', username);
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
