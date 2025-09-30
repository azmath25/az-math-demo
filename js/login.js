const SCRIPT_URL = "YOUR_WEBAPP_URL";
document.getElementById("login-form").addEventListener("submit", async e => {
  e.preventDefault();
  const form = e.target;
  const data = { action: "login", email: form.email.value, password: form.password.value };
  const res = await fetch(SCRIPT_URL, { method: "POST", body: JSON.stringify(data) });
  const result = await res.json();
  if (result.success) { localStorage.setItem("token", result.token); window.location = "admin.html"; }
  else { document.getElementById("login-error").textContent = "Login failed"; }
});