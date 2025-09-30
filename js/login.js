// login.js
async function api(action, payload={}) {
  const res = await fetch(CONFIG.SCRIPT_URL, { method: 'POST', body: JSON.stringify(Object.assign({action}, payload)) });
  return res.json();
}

async function login(){
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  document.getElementById('login-msg').textContent = 'Signing in...';
  try {
    const res = await api('login', { email, password });
    if (res.token) {
      localStorage.setItem('az_token', res.token);
      location.href = 'admin.html';
    } else {
      document.getElementById('login-msg').textContent = res.error || 'Login failed.';
    }
  } catch(e){
    document.getElementById('login-msg').textContent = 'Error';
    console.error(e);
  }
}

// expose login globally so button onclick works
window.login = login;
