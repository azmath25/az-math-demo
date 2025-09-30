const SCRIPT_URL = "YOUR_WEBAPP_URL";
async function loadProblems() {
  const res = await fetch(SCRIPT_URL, { method: "POST", body: JSON.stringify({ action: "getProblems" }) });
  const problems = await res.json();
  const container = document.getElementById("problems");
  container.innerHTML = "";
  problems.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h3>${p.title}</h3><p>${p.statement}</p>`;
    card.onclick = () => window.location = `problem.html?id=${p.id}`;
    container.appendChild(card);
  });
}
loadProblems();