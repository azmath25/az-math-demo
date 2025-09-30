const SCRIPT_URL = "YOUR_WEBAPP_URL";
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
async function loadProblem() {
  const res = await fetch(SCRIPT_URL, { method: "POST", body: JSON.stringify({ action: "getProblem", id }) });
  const p = await res.json();
  const container = document.getElementById("problem-container");
  container.innerHTML = `<h2>${p.title}</h2><p>${p.statement}</p><h3>Solution</h3><p>${p.solution}</p>`;
}
loadProblem();