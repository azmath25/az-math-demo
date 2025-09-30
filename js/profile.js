const SCRIPT_URL = "YOUR_WEBAPP_URL";
async function loadProfile() {
  const res = await fetch(SCRIPT_URL, { method: "POST", body: JSON.stringify({ action: "getProfile", token: localStorage.getItem("token") }) });
  const profile = await res.json();
  document.getElementById("profile-container").innerHTML = `<h2>${profile.email}</h2><p>Problems added: ${profile.problemsAdded}</p>`;
}
loadProfile();