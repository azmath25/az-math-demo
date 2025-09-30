async function loadProblems() {
  try {
    const res = await fetch(APP_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({ action: "getProblems" }),
      headers: { "Content-Type": "application/json" }
    });
    const problems = await res.json();
    renderProblems(problems);
  } catch (err) {
    document.getElementById("problems").innerText = "Error loading problems.";
  }
}

function renderProblems(problems) {
  const container = document.getElementById("problems");
  container.innerHTML = "";
  problems.forEach(p => {
    const card = document.createElement("div");
    card.className = "problem-card";
    card.innerHTML = `
      <h3>${p.title}</h3>
      <p>${p.statement}</p>
      <div class="solution" style="display:none;">
        <strong>Solution:</strong>
        <p>${p.solution}</p>
      </div>
    `;
    card.addEventListener("click", () => {
      const sol = card.querySelector(".solution");
      sol.style.display = sol.style.display === "none" ? "block" : "none";
      MathJax.typeset();
    });
    container.appendChild(card);
  });
  MathJax.typeset();
}

window.onload = loadProblems;
