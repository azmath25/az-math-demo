// main.js - list problems for public site
async function api(action, payload = {}) {
  const body = Object.assign({ action }, payload);
  const res = await fetch(CONFIG.SCRIPT_URL, { method: 'POST', body: JSON.stringify(body) });
  return res.json();
}

function escapeHtml(s=''){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function createCard(p){
  const el = document.createElement('div'); el.className='card';
  el.innerHTML = `<h3>${escapeHtml(p.title)}</h3>
    <p class="muted">Category: ${escapeHtml(p.category||'')}</p>
    <div class="statement">${p.statement}</div>
    <div class="solution" style="display:none;margin-top:12px">${p.solution || '<span class="muted">no solution</span>'}</div>`;
  let clickTimeout;
  el.addEventListener('click', ()=> {
    clickTimeout = setTimeout(() => {
      const s = el.querySelector('.solution');
      s.style.display = s.style.display === 'none' ? 'block' : 'none';
      if (window.MathJax) MathJax.typeset();
    }, 200);
  });
  el.addEventListener('dblclick', ()=> {
    clearTimeout(clickTimeout);
    const id = p.id;
    location.href = `problem.html?id=${id}`;
  });
  return el;
}

async function loadProblems(){
  const container = document.getElementById('problems');
  container.textContent = 'Loading...';
  try {
    const res = await api('getProblems');
    if (!Array.isArray(res) || res.length===0){ container.innerHTML = '<p class="muted">No problems yet.</p>'; return; }
    container.innerHTML = '';
    res.sort((a,b)=> Number(a.id) - Number(b.id));
    res.forEach(p => container.appendChild(createCard(p)));
    MathJax && MathJax.typeset && MathJax.typeset();
  } catch(err){
    container.textContent = 'Error loading problems.';
    console.error(err);
  }
}

window.addEventListener('DOMContentLoaded', loadProblems);

