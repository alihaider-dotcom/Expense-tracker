const API_BASE = '/api'
let editingId = null

async function fetchJSON(url, opts){
  const res = await fetch(url, opts)
  if(!res.ok) throw new Error('Network error')
  return res.json()
}

function formatCurrency(v){ return Number(v).toLocaleString(undefined, {style:'currency',currency:'USD'}) }

async function loadExpenses(){
  const data = await fetchJSON(`${API_BASE}/expenses`)
  renderTable(data)
  renderCharts()
}

function renderTable(items){
  const tbody = document.querySelector('#expenses-table tbody')
  tbody.innerHTML = ''
  items.sort((a,b)=> new Date(b.date) - new Date(a.date))
  items.forEach(it=>{
    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td>${it.date}</td>
      <td>${escapeHtml(it.category)}</td>
      <td>${escapeHtml(it.description||'')}</td>
      <td class="amount">${formatCurrency(it.amount)}</td>
      <td>
        <button class="small" data-id="${it.id}" data-action="edit">Edit</button>
        <button class="small" data-id="${it.id}" data-action="delete">Delete</button>
      </td>
    `
    tbody.appendChild(tr)
  })
}

function escapeHtml(s){ if(!s) return ''; return s.replace(/[&"'<>]/g, c=>({ '&':'&amp;','"':'&quot;','\'':'&#39;','<':'&lt;','>':'&gt;' }[c])) }

async function submitForm(e){
  e.preventDefault()
  const id = document.getElementById('expense-id').value || null
  const date = document.getElementById('date').value
  const amount = document.getElementById('amount').value
  const category = document.getElementById('category').value.trim()
  const description = document.getElementById('description').value.trim()
  if(!date || !amount || !category) return alert('Please fill required fields')
  const payload = { date, amount: Number(amount), category, description }
  try{
    if(id){
      await fetchJSON(`${API_BASE}/expenses/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) })
      clearForm()
    } else {
      await fetchJSON(`${API_BASE}/expenses`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) })
      clearForm()
    }
    loadExpenses()
  }catch(err){ console.error(err); alert('Failed to save') }
}

function clearForm(){
  editingId = null
  document.getElementById('expense-id').value = ''
  document.getElementById('expense-form').reset()
  document.getElementById('save-btn').textContent = 'Add Expense'
}

document.addEventListener('click', async (ev)=>{
  const btn = ev.target.closest('button')
  if(!btn) return
  const action = btn.dataset.action
  const id = btn.dataset.id
  if(action==='edit'){
    const resp = await fetchJSON(`${API_BASE}/expenses`)
    const item = resp.find(x=>x.id===id)
    if(!item) return alert('Not found')
    editingId = id
    document.getElementById('expense-id').value = item.id
    document.getElementById('date').value = item.date
    document.getElementById('amount').value = item.amount
    document.getElementById('category').value = item.category
    document.getElementById('description').value = item.description || ''
    document.getElementById('save-btn').textContent = 'Save'
  }
  if(action==='delete'){
    if(!confirm('Delete this expense?')) return
    try{ await fetchJSON(`${API_BASE}/expenses/${id}`, { method:'DELETE' }) ; loadExpenses() }
    catch(e){ console.error(e); alert('Delete failed') }
  }
})

document.getElementById('expense-form').addEventListener('submit', submitForm)
document.getElementById('cancel-edit').addEventListener('click', clearForm)

let pieChart=null, barChart=null

async function renderCharts(){
  const data = await fetchJSON(`${API_BASE}/summary`)
  const catLabels = data.category_totals.map(x=>x.category)
  const catValues = data.category_totals.map(x=>x.total)
  const months = data.monthly_totals.map(x=>x.month)
  const monthValues = data.monthly_totals.map(x=>x.total)

  const pieCtx = document.getElementById('pieChart').getContext('2d')
  if(pieChart) pieChart.destroy()
  pieChart = new Chart(pieCtx, {
    type:'pie',
    data:{ labels:catLabels, datasets:[{ data:catValues, backgroundColor:generatePalette(catLabels.length) }]},
    options:{ plugins:{ legend:{ position:'bottom' } } }
  })

  const barCtx = document.getElementById('barChart').getContext('2d')
  if(barChart) barChart.destroy()
  barChart = new Chart(barCtx, {
    type:'bar', data:{ labels:months, datasets:[{ label:'Total', data:monthValues, backgroundColor:'#94a3b8' }] },
    options:{ scales:{ y:{ beginAtZero:true } }, plugins:{ legend:{ display:false } } }
  })
}

function generatePalette(n){
  const base = ['#111827','#374151','#4b5563','#6b7280','#9ca3af','#cbd5e1','#e6e7ea']
  const out = []
  for(let i=0;i<n;i++) out.push(base[i%base.length])
  return out
}

// initial load
loadExpenses()
