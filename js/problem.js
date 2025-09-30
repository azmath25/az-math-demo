// problem.js - load single problem by id (from query)
async function api(action, payload = {}) {
  const res = await fetch(CONFIG.SCRIPT_URL, { method: 'POST', body: JSON.stringify(Object.assign({action}, payload)) });
  return res.json();
}

function escapeHtml(s=''){ 
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;'); 
}

async function loadProblem(){
  const id = new URLSearchParams(location.search).get('id');
  const el = document.getElementById('problem-article');
  el.textContent = 'Loading...';
  if (!id) { 
    el.innerHTML = '<p class="muted">No ID provided.</p>'; 
    return; 
  }
  try {
    const res = await api('getProblem', { id });
    if (!res) { 
      el.innerHTML = '<p class="muted">Problem not found.</p>'; 
      return; 
    }
    el.innerHTML = `
      <h2>${escapeHtml(res.title)}</h2>
      <p class="muted">Category: ${escapeHtml(res.category||'')}</p>
      <section class="card" style="margin-top:12px">
        <div class="statement">${res.statement}</div>
        <hr/>
        <div class="solution" style="display:none">
          ${res.solution || '<span class="muted">No solution</span>'}
        </div>
        <div style="margin-top:12px">
          <button id="toggle-solution">Show solution</button>
          <button id="edit-btn" style="display:none;margin-left:8px">Edit</button>
        </div>
      </section>`;

    // Toggle show/hide solution
    const solutionEl = el.querySelector('.solution');
    const toggleBtn = document.getElementById('toggle-solution');
    toggleBtn.addEventListener('click', ()=>{
      if (solutionEl.style.display === 'none') {
        solutionEl.style.display = 'block';
        toggleBtn.textContent = 'Hide solution';
        MathJax && MathJax.typeset && MathJax.typeset();
      } else {
        solutionEl.style.display = 'none';
        toggleBtn.textContent = 'Show solution';
      }
    });

    // Show edit if logged in
    const token = localStorage.getItem('az_token');
    if (token){
      const who = await api('whoami', { token });
      if (who && who.email) document.getElementById('edit-btn').style.display='inline-block';
      document.getElementById('edit-btn').addEventListener('click', ()=> 
        location.href = `edit.html?id=${res.id}`
      );
    }
  } catch(err){
    el.textContent = 'Error loading problem.'; 
    console.error(err);
  }
}

window.addEventListener('DOMContentLoaded', loadProblem);
