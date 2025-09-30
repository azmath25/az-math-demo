// profile.js
async function api(action, payload={}) {
  const token = localStorage.getItem('az_token');
  const res = await fetch(CONFIG.SCRIPT_URL, { method: 'POST', body: JSON.stringify(Object.assign({action, token}, payload)) });
  return res.json();
}

async function loadProfile(){
  const res = await api('getProfile');
  const el = document.getElementById('profile-info');
  if (res.error) { el.textContent = 'Not logged in.'; return; }
  el.innerHTML = `<h2>${res.email}</h2>
    <p>Created: ${res.createdCount}</p>
    <p>Edited: ${res.editedCount}</p>`;
}
window.addEventListener('DOMContentLoaded', loadProfile);
