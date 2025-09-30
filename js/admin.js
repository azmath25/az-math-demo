let token = null;

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(APP_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({ action: "login", email, password }),
    headers: { "Content-Type": "application/json" }
  });

  const result = await res.json();
  if (result.success) {
    token = result.token;
    document.getElementById("login-section").style.display = "none";
    document.getElementById("admin-section").style.display = "block";
    loadProblems();
  } else {
    document.getElementById("login-status").innerText = "Login failed";
  }
}

async function loadProblems() {
  const res = await fetch(APP_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({ action: "getProblems", token }),
    headers: { "Content-Type": "application/json" }
  });
  const problems = await res.json();
  renderAdminProblems(problems);
}

function renderAdminProblems(problems) {
  const container = document.getElementById("problems");
  container.innerHTML = "";
  problems.forEach(p => {
    const card = document.createElement("div");
    card.className = "problem-card";
    card.innerHTML = `
      <h3>${p.title}</h3>
      <p>${p.statement}</p>
      <button onclick="deleteProblem(${p.id})">Delete</button>
    `;
    container.appendChild(card);
  });
  MathJax.typeset();
}

async function addProblem() {
  const title = document.getElementById("title").value;
  const statement = document.getElementById("statement").value;
  const solution = document.getElementById("solution").value;

  await fetch(APP_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({ action: "addProblem", token, title, statement, solution }),
    headers: { "Content-Type": "application/json" }
  });
  loadProblems();
}

async function deleteProblem(id) {
  await fetch(APP_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({ action: "deleteProblem", token, id }),
    headers: { "Content-Type": "application/json" }
  });
  loadProblems();
}
