// edit.js - used by edit.html to load single problem into form and save or delete
async function api(action, payload={}) {
  const token = localStorage.getItem('az_token');
  const res = await fetch(CONFIG.SCRIPT_URL, { method: 'POST', body: JSON.stringify(Object.assign({action, token}, payload)) });
  return res.json();
}

function qs(name){ return new URLSearchParams(location.search).get(name); }

async function loadProblemForEdit(){
  const id = qs('id');
  if (!id) return;
  const res = await api('getProblem', { id });
  if (!res) { alert('Not found'); return; }
  document.getElementById('problem-id').value = res.id;
  document.getElementById('title').value = res.title||'';
  document.getElementById('category').value = res.category||'';
  document.getElementById('statement').value = res.statement||'';
  document.getElementById('solution').value = res.solution||'';
}

document.getElementById && document.getElementById('edit-form')?.addEventListener('submit', async function(e){
  e.preventDefault();
  const id = document.getElementById('problem-id').value || null;
  const payload = {
    problem: {
      id: id ? Number(id) : null,
      title: document.getElementById('title').value.trim(),
      category: document.getElementById('category').value.trim(),
      statement: document.getElementById('statement').value.trim(),
      solution: document.getElementById('solution').value.trim()
    }
  };
  const res = await api('saveProblem', payload);
  if (res.error) alert('Error: ' + res.error); else location.href = 'admin.html';
});

document.getElementById && document.getElementById('delete-btn')?.addEventListener('click', async function(){
  const id = document.getElementById('problem-id').value;
  if (!id) { alert('No problem'); return; }
  if (!confirm('Delete problem #' + id + '?')) return;
  const res = await api('deleteProblem', { id });
  if (res.error) alert('Error: ' + res.error); else location.href='admin.html';
});

window.addEventListener('DOMContentLoaded', loadProblemForEdit);
