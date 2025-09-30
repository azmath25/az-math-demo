// admin.js - admin functions: list, add, delete, open modal, logout
async function api(action, payload={}) {
  const token = localStorage.getItem('az_token');
  const res = await fetch(CONFIG.SCRIPT_URL, { method: 'POST', body: JSON.stringify(Object.assign({action, token}, payload)) });
  return res.json();
}

function escapeHtml(s=''){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function createAdminCard(p){
  const el = document.createElement('div'); el.className='card';
  el.innerHTML = `<h3>${escapeHtml(p.title)}</h3>
    <p class="muted">Category: ${escapeHtml(p.category||'')}</p>
    <div class="statement">${p.statement}</div>
    <div style="margin-top:12px">
      <button onclick="location.href='edit.html?id=${p.id}'">Edit</button>
      <button class="danger" onclick="deleteProblem(${p.id})">Delete</button>
    </div>`;
  return el;
}

async function loadProblems(){
  const container = document.getElementById('problems');
  container.textContent = 'Loading...';
  try {
    const res = await api('getProblems');
    if (!Array.isArray(res)) { container.textContent = 'Error'; return; }
    container.innerHTML = '';
    res.sort((a,b)=> Number(a.id)-Number(b.id));
    res.forEach(p => container.appendChild(createAdminCard(p)));
    MathJax && MathJax.typeset && MathJax.typeset();
  } catch(e){
    container.textContent = 'Error loading problems.'; console.error(e);
  }
}

function openAddForm(){
  const html = `
    <div class="modal" id="add-modal">
      <h3>Add New Problem</h3>
      <label>Title</label><input id="m_title" />
      <label>Category</label><input id="m_category" />
      <label>Statement</label><textarea id="m_statement" rows="6"></textarea>
      <label>Solution</label><textarea id="m_solution" rows="6"></textarea>
      <div style="display:flex;gap:8px;margin-top:10px">
        <button onclick="saveNewProblem()">Save</button>
        <button onclick="closeModal()">Cancel</button>
      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
}

function closeModal(){
  const m = document.getElementById('add-modal');
  if (m) m.remove();
}

async function saveNewProblem(){
  const title = document.getElementById('m_title').value.trim();
  const category = document.getElementById('m_category').value.trim();
  const statement = document.getElementById('m_statement').value.trim();
  const solution = document.getElementById('m_solution').value.trim();
  if (!title || !statement) { alert('Title and statement required'); return; }
  try {
    const res = await api('saveProblem', { problem: { title, category, statement, solution } });
    if (res.error) { alert('Error: ' + res.error); } else { closeModal(); loadProblems(); alert('Saved id: ' + res.id); }
  } catch(e){ alert('Error'); console.error(e); }
}

async function deleteProblem(id){
  if (!confirm('Delete problem #' + id + '?')) return;
  try {
    const res = await api('deleteProblem', { id });
    if (res.error) alert('Error: ' + res.error);
    else loadProblems();
  } catch(e){ alert('Error'); console.error(e); }
}

function logout(){ localStorage.removeItem('az_token'); location.href='login.html'; }

// init
window.addEventListener('DOMContentLoaded', loadProblems);
window.openAddForm = openAddForm;
window.closeModal = closeModal;
window.saveNewProblem = saveNewProblem;
window.deleteProblem = deleteProblem;
window.logout = logout;
