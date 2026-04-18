/* ============================================
   LUMINAE EVENTS — ADMIN PANEL JS
   js/admin.js
============================================ */

const ROWS_PER_PAGE = 8;
let allData        = [];
let filteredData   = [];
let currentPage    = 1;
let deleteTargetId = null;

/* ============================================================
   LOAD REGISTRATIONS from PHP backend
============================================================ */
function loadRegistrations() {
  showLoading();

  fetch('php/fetch_registrations.php')
    .then(res => {
      if (!res.ok) throw new Error('Server error');
      return res.json();
    })
    .then(data => {
      if (data.success && Array.isArray(data.registrations)) {
        allData = data.registrations;
        filteredData = [...allData];
        renderStats();
        renderTable();
        showTable();
      } else {
        throw new Error(data.message || 'Unknown error');
      }
    })
    .catch(err => {
      console.warn('Backend unavailable, loading demo data:', err.message);
      showError();
    });
}

/* ============================================================
   DEMO DATA (for when no server is running)
============================================================ */
function loadDemoData() {
  allData = [
    { id: 1, full_name: 'Rahul Sharma',   email: 'rahul@techcorp.in',  phone: '+91 98765 43210', company: 'Tech Corp Ltd',        event_type: 'corporate',   event_date: '2024-04-15', attendees: '50-200',  city: 'Pune',      message: 'Looking for a tech leadership summit with AV setup and catering for 100+ executives.', status: 'confirmed', created_at: '2024-03-20 10:30:00' },
    { id: 2, full_name: 'Priya Mehta',    email: 'priya@brandco.in',   phone: '+91 87654 32109', company: 'Brand Co.',             event_type: 'activation',  event_date: '2024-05-18', attendees: '1000+',   city: 'Mumbai',    message: 'BTL brand activation across 5 malls in Mumbai. Need full team, props and sampling kits.', status: 'pending',   created_at: '2024-03-21 14:15:00' },
    { id: 3, full_name: 'Arun Kumar',     email: 'arun@expoindia.com', phone: '+91 76543 21098', company: 'Expo India',            event_type: 'exhibition',  event_date: '2024-04-22', attendees: '1000+',   city: 'Mumbai',    message: 'Exhibition stall design and setup for India Manufacturing Expo. Need 400 sqft stall.', status: 'confirmed', created_at: '2024-03-22 09:45:00' },
    { id: 4, full_name: 'Sneha Patil',    email: 'sneha@fingroup.in',  phone: '+91 65432 10987', company: 'Finance Group India',   event_type: 'conference',  event_date: '2024-05-03', attendees: '200-500', city: 'Bangalore', message: 'Finance conference for CFOs and senior executives. Need stage, professional lighting.', status: 'pending',   created_at: '2024-03-23 16:30:00' },
    { id: 5, full_name: 'Vikram Nair',    email: 'vikram@launchpad.in',phone: '+91 55544 33211', company: 'LaunchPad Inc',         event_type: 'launch',      event_date: '2024-06-10', attendees: '200-500', city: 'Hyderabad', message: 'Product launch event for our new consumer electronics line. Expecting press coverage.', status: 'pending',   created_at: '2024-03-24 11:00:00' },
    { id: 6, full_name: 'Ananya Singh',   email: 'ananya@awardsinc.in',phone: '+91 44433 22100', company: 'Awards Inc.',           event_type: 'award',       event_date: '2024-06-05', attendees: '50-200',  city: 'Delhi',     message: 'Annual corporate award ceremony. Black-tie event with 200 guests. Need full AV.', status: 'confirmed', created_at: '2024-03-25 08:00:00' },
    { id: 7, full_name: 'Karan Joshi',    email: 'karan@healthco.in',  phone: '+91 33322 11099', company: 'HealthCo Pharma',       event_type: 'conference',  event_date: '2024-06-20', attendees: '200-500', city: 'Chennai',   message: 'Healthcare innovation summit for pharma leaders and medtech professionals.', status: 'cancelled', created_at: '2024-03-26 13:20:00' },
    { id: 8, full_name: 'Deepika Rao',    email: 'deepika@startups.in',phone: '+91 22211 00988', company: 'Startup Hub',           event_type: 'corporate',   event_date: '2024-07-12', attendees: '1-50',    city: 'Pune',      message: 'Team building retreat for our 40-member startup. Looking for offsite activity setup.', status: 'pending',   created_at: '2024-03-27 10:10:00' },
    { id: 9, full_name: 'Amit Desai',     email: 'amit@megaexpo.com',  phone: '+91 11100 99877', company: 'Mega Expo Pvt Ltd',     event_type: 'exhibition',  event_date: '2024-07-20', attendees: '1000+',   city: 'Ahmedabad', message: 'Large scale industrial exhibition. Need end-to-end execution including stall fabrication.', status: 'confirmed', created_at: '2024-03-28 15:45:00' },
    { id:10, full_name: 'Riya Kapoor',    email: 'riya@activate.in',   phone: '+91 99988 77665', company: 'Activate Brands',       event_type: 'activation',  event_date: '2024-08-01', attendees: '500-1000',city: 'Kolkata',   message: 'Consumer activation campaign in 10 locations across Kolkata metro area.', status: 'pending',   created_at: '2024-03-29 09:30:00' },
  ];
  filteredData = [...allData];
  renderStats();
  renderTable();
  showTable();
  showToast('Demo data loaded for preview', 'info');
}

/* ============================================================
   RENDER STATS CARDS
============================================================ */
function renderStats() {
  const total     = allData.length;
  const pending   = allData.filter(r => r.status === 'pending').length;
  const confirmed = allData.filter(r => r.status === 'confirmed').length;
  const cities    = new Set(allData.map(r => r.city)).size;

  animateNumber('statTotal',     total);
  animateNumber('statPending',   pending);
  animateNumber('statConfirmed', confirmed);
  animateNumber('statCities',    cities);
}

function animateNumber(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let start = 0;
  const duration = 800;
  const step = (timestamp) => {
    if (!step.start) step.start = timestamp;
    const progress = Math.min((timestamp - step.start) / duration, 1);
    el.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

/* ============================================================
   RENDER TABLE
============================================================ */
function renderTable() {
  const tbody = document.getElementById('tableBody');
  const empty = document.getElementById('tableEmpty');
  const pagination = document.getElementById('pagination');
  if (!tbody) return;

  if (filteredData.length === 0) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
    pagination.innerHTML = '';
    return;
  }
  empty.style.display = 'none';

  // Paginate
  const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);
  if (currentPage > totalPages) currentPage = 1;
  const start = (currentPage - 1) * ROWS_PER_PAGE;
  const pageData = filteredData.slice(start, start + ROWS_PER_PAGE);

  tbody.innerHTML = pageData.map(row => `
    <tr id="row-${row.id}">
      <td class="td-id">#${row.id}</td>
      <td class="td-name">${escHtml(row.full_name)}</td>
      <td class="td-email">${escHtml(row.email)}</td>
      <td>${escHtml(row.phone)}</td>
      <td><span class="event-type-badge badge-${row.event_type}">${capitalize(row.event_type)}</span></td>
      <td>${formatDate(row.event_date)}</td>
      <td>${escHtml(row.attendees)}</td>
      <td>${escHtml(row.city)}</td>
      <td>
        <span class="status-badge status-${row.status}">
          <span class="status-dot"></span>
          ${capitalize(row.status)}
        </span>
      </td>
      <td>${formatDateTime(row.created_at)}</td>
      <td>
        <div class="action-btns">
          <button class="btn-view" onclick="viewRegistration(${row.id})">👁 View</button>
          <button class="btn-delete" onclick="confirmDelete(${row.id})">🗑 Delete</button>
        </div>
      </td>
    </tr>
  `).join('');

  // Render pagination
  renderPagination(totalPages);
}

/* ============================================================
   PAGINATION
============================================================ */
function renderPagination(totalPages) {
  const el = document.getElementById('pagination');
  if (!el || totalPages <= 1) { el.innerHTML = ''; return; }

  let html = '';
  if (currentPage > 1) html += `<button class="page-btn" onclick="goPage(${currentPage-1})">‹</button>`;
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goPage(${i})">${i}</button>`;
  }
  if (currentPage < totalPages) html += `<button class="page-btn" onclick="goPage(${currentPage+1})">›</button>`;
  el.innerHTML = html;
}
function goPage(page) { currentPage = page; renderTable(); }

/* ============================================================
   SEARCH & FILTER
============================================================ */
const searchInput  = document.getElementById('searchInput');
const filterStatus = document.getElementById('filterStatus');

if (searchInput) {
  searchInput.addEventListener('input', applyFilters);
}
if (filterStatus) {
  filterStatus.addEventListener('change', applyFilters);
}

function applyFilters() {
  const query  = (searchInput?.value || '').toLowerCase().trim();
  const status = filterStatus?.value || 'all';

  filteredData = allData.filter(row => {
    const matchStatus = status === 'all' || row.status === status;
    const matchSearch = !query ||
      row.full_name.toLowerCase().includes(query) ||
      row.email.toLowerCase().includes(query) ||
      row.city.toLowerCase().includes(query) ||
      row.company?.toLowerCase().includes(query) ||
      row.event_type.toLowerCase().includes(query);
    return matchStatus && matchSearch;
  });

  currentPage = 1;
  renderTable();
}

/* ============================================================
   VIEW MODAL
============================================================ */
function viewRegistration(id) {
  const row = allData.find(r => r.id === id);
  if (!row) return;

  document.getElementById('modalContent').innerHTML = `
    <div class="detail-grid">
      <div class="detail-item">
        <div class="detail-label">Full Name</div>
        <div class="detail-value">${escHtml(row.full_name)}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Email</div>
        <div class="detail-value">${escHtml(row.email)}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Phone</div>
        <div class="detail-value">${escHtml(row.phone)}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Company</div>
        <div class="detail-value">${escHtml(row.company || '—')}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Event Type</div>
        <div class="detail-value"><span class="event-type-badge badge-${row.event_type}">${capitalize(row.event_type)}</span></div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Event Date</div>
        <div class="detail-value">${formatDate(row.event_date)}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Attendees</div>
        <div class="detail-value">${escHtml(row.attendees)}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">City</div>
        <div class="detail-value">${escHtml(row.city)}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Status</div>
        <div class="detail-value"><span class="status-badge status-${row.status}"><span class="status-dot"></span>${capitalize(row.status)}</span></div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Registered On</div>
        <div class="detail-value">${formatDateTime(row.created_at)}</div>
      </div>
      <div class="detail-item full">
        <div class="detail-label">Message</div>
        <div class="detail-value">${escHtml(row.message)}</div>
      </div>
    </div>
  `;
  document.getElementById('viewModal').style.display = 'flex';
}
function closeViewModal() { document.getElementById('viewModal').style.display = 'none'; }

/* ============================================================
   DELETE
============================================================ */
function confirmDelete(id) {
  deleteTargetId = id;
  document.getElementById('deleteModal').style.display = 'flex';
}
function closeDeleteModal() {
  deleteTargetId = null;
  document.getElementById('deleteModal').style.display = 'none';
}

document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
  if (!deleteTargetId) return;
  const id = deleteTargetId;
  closeDeleteModal();

  fetch('php/delete_registration.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `id=${id}`
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      deleteRow(id);
      showToast('Registration deleted successfully', 'success');
    } else {
      showToast(data.message || 'Delete failed', 'error');
    }
  })
  .catch(() => {
    // Demo mode: delete from local data
    deleteRow(id);
    showToast('Registration deleted (demo mode)', 'success');
  });
});

function deleteRow(id) {
  allData      = allData.filter(r => r.id !== id);
  filteredData = filteredData.filter(r => r.id !== id);
  renderStats();
  renderTable();
}

/* ============================================================
   TOAST
============================================================ */
function showToast(msg, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast ${type} show`;
  setTimeout(() => { toast.classList.remove('show'); }, 3500);
}

/* ============================================================
   UI STATE HELPERS
============================================================ */
function showLoading() {
  document.getElementById('adminLoading').style.display = 'block';
  document.getElementById('adminError').style.display   = 'none';
  document.getElementById('tableWrap').style.display    = 'none';
}
function showTable() {
  document.getElementById('adminLoading').style.display = 'none';
  document.getElementById('adminError').style.display   = 'none';
  document.getElementById('tableWrap').style.display    = 'block';
}
function showError() {
  document.getElementById('adminLoading').style.display = 'none';
  document.getElementById('adminError').style.display   = 'block';
  document.getElementById('tableWrap').style.display    = 'none';
}

/* ============================================================
   CLOSE MODALS ON OVERLAY CLICK
============================================================ */
document.getElementById('deleteModal').addEventListener('click', function(e) {
  if (e.target === this) closeDeleteModal();
});
document.getElementById('viewModal').addEventListener('click', function(e) {
  if (e.target === this) closeViewModal();
});

/* ============================================================
   HELPERS
============================================================ */
function escHtml(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}
function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) +
         ' ' + d.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
}

/* ============================================================
   INIT
============================================================ */
loadRegistrations();
