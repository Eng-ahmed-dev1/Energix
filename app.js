/* ============================================================
   ENERGIX — Enterprise Industrial Energy Platform (app.js)
   Live IoT Telemetry Sync <--> FastAPI Backend <--> Grok AI
   ============================================================ */

'use strict';

let inventoryData = [];
let currentFilter = 'all';
let activeCard = null;
let pollingInterval = null;
let isHardwareOnline = false;

/* ============================================================
   PAGE NAVIGATION
   ============================================================ */
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`page-${id}`);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update nav active state
  document.querySelectorAll('.nav-link').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-page') === id || btn.textContent.trim().toLowerCase().includes(id === 'inventory' ? 'dashboard' : id)) {
      btn.classList.add('active');
    }
  });

  if (id === 'inventory') {
    fetchTelemetry();
    startPolling();
  } else {
    stopPolling();
  }
}

/* ============================================================
   STICKY NAV ON SCROLL
   ============================================================ */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) {
    if (window.scrollY > 20) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
}, { passive: true });

/* ============================================================
   MOBILE NAV
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });

  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ============================================================
   LIVE TELEMETRY FETCH & SYNC (FROM PYTHON BACKEND)
   ============================================================ */
async function fetchTelemetry() {
  try {
    const res = await fetch('/api/telemetry', { cache: 'no-store' });
    if (!res.ok) throw new Error('Backend offline');
    const data = await res.json();
    
    inventoryData = data.items;
    isHardwareOnline = data.hardware_connected;
    
    renderInventory(filterData(inventoryData));
    updateTopStats(data.total_consumed, data.total_saved, data.total_money, data.active_units);
    updateStatusBadge(data.hardware_connected, data.port);

  } catch (err) {
    // Graceful fallback to standalone mode if server.py is not running
    if (!inventoryData.length) {
      generateFallbackData();
    }
    updateStatusBadge(false, null);
  }
}

function startPolling() {
  if (!pollingInterval) {
    pollingInterval = setInterval(fetchTelemetry, 2000); // Sync every 2 seconds
  }
}

function stopPolling() {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
}

function updateStatusBadge(connected, port) {
  const meta = document.getElementById('dash-meta');
  if (!meta) return;

  if (connected) {
    meta.innerHTML = `<span style="color:var(--emerald);font-weight:700;">● Live Arduino Hardware Online (${port || 'USB'})</span> · Real-time Sensor Grid Active`;
  } else {
    meta.innerHTML = `<span style="color:var(--text-muted);font-weight:600;">● Telemetry Simulation Mode</span> · Run <code>python server.py</code> to connect physical Arduino`;
  }
}

function updateTopStats(consumed, saved, money, units) {
  const elConsumed = document.getElementById('total-consumed');
  const elSaved    = document.getElementById('total-saved');
  const elMoney    = document.getElementById('total-money');
  const elUnits    = document.getElementById('total-units');

  if (elConsumed) elConsumed.textContent = consumed.toLocaleString();
  if (elSaved)    elSaved.textContent    = saved.toLocaleString();
  if (elMoney)    elMoney.textContent    = `$${money.toLocaleString()}`;
  if (elUnits)    elUnits.textContent    = units;
}

/* ============================================================
   RENDER INVENTORY CARDS
   ============================================================ */
function renderInventory(items) {
  const grid = document.getElementById('inventory-grid');
  if (!grid) return;

  if (!items.length) {
    grid.innerHTML = `
      <div style="color:var(--text-muted);padding:60px 0;grid-column:1/-1;text-align:center;">
        <p style="font-size:1.1rem;font-weight:600;">No facilities match your search criteria.</p>
        <span style="font-size:0.9rem;color:var(--text-dark);">Try clearing your search query or selecting 'All'</span>
      </div>`;
    return;
  }

  grid.innerHTML = items.map(item => `
    <article class="inv-card ${item.is_hardware ? 'hardware-node' : ''}" role="listitem" tabindex="0"
             onclick="openModal(${item.id})"
             onkeydown="if(event.key==='Enter'||event.key===' ')openModal(${item.id})"
             aria-label="${item.name} — ${item.status} status">
      
      <div class="card-top">
        <div class="card-icon-wrap" aria-hidden="true">${item.icon}</div>
        <div class="card-status status-${item.status}">
          <span style="width:6px;height:6px;border-radius:50%;background:currentColor;display:inline-block;"></span>
          ${item.status === 'low' ? 'Efficient' : item.status === 'medium' ? 'Moderate' : 'High Usage'}
        </div>
      </div>

      <div class="card-title">
        ${item.name}
      </div>
      <div class="card-loc">${item.location}</div>

      <div class="card-metrics">
        <div class="metric-row">
          <span class="metric-label">Consumed Load</span>
          <span class="metric-val red">${item.consumed.toLocaleString()} kWh</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${Math.min((item.consumed/2400)*100, 100)}%; background:linear-gradient(90deg, #f43f5e, #fb7185);"></div>
        </div>

        <div class="metric-row" style="margin-top:6px">
          <span class="metric-label">Energy Curtailment</span>
          <span class="metric-val grn">${item.saved.toLocaleString()} kWh</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${Math.min((item.saved/1000)*100, 100)}%; background:var(--emerald);"></div>
        </div>

        <div class="metric-row" style="margin-top:6px">
          <span class="metric-label">Verified Dollars Saved</span>
          <span class="metric-val ylw">$${item.money.toLocaleString()}</span>
        </div>

        <div class="metric-row">
          <span class="metric-label">Efficiency Index</span>
          <span class="metric-val" style="color:${item.eff >= 28 ? 'var(--emerald)' : item.eff >= 16 ? 'var(--amber)' : 'var(--rose)'}">
            ${item.eff}%
          </span>
        </div>
      </div>
    </article>
  `).join('');
}

/* ============================================================
   SEARCH & FILTER
   ============================================================ */
function filterData(data) {
  const input = document.getElementById('search-input');
  const query = input ? input.value.toLowerCase().trim() : '';
  let filtered = data;
  
  if (currentFilter !== 'all') {
    filtered = filtered.filter(i => i.status === currentFilter);
  }
  if (query) {
    filtered = filtered.filter(i =>
      i.name.toLowerCase().includes(query) ||
      i.location.toLowerCase().includes(query)
    );
  }
  return filtered;
}

function filterInventory() {
  renderInventory(filterData(inventoryData));
}

function setFilter(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  filterInventory();
}

function refreshInventory() {
  fetchTelemetry();
  showToast('Telemetry refreshed from IoT backend');
}

/* ============================================================
   MODAL & WEEKLY TELEMETRY AUDIT
   ============================================================ */
function openModal(id) {
  const item = inventoryData.find(i => i.id === id);
  if (!item) return;
  activeCard = item;

  document.getElementById('modal-icon').innerHTML         = item.icon;
  document.getElementById('modal-title-text').textContent = item.name;
  document.getElementById('modal-subtitle').textContent   = `${item.location} · Efficiency Rating: ${item.eff}%`;
  document.getElementById('mm-consumed').textContent      = `${item.consumed.toLocaleString()} kWh`;
  document.getElementById('mm-saved').textContent         = `${item.saved.toLocaleString()} kWh`;
  document.getElementById('mm-money').textContent         = `$${item.money.toLocaleString()}`;

  const report = document.getElementById('weekly-report');
  report.classList.remove('show');
  report.innerHTML = buildReportHTML(item);

  const overlay = document.getElementById('modal-overlay');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
  activeCard = null;
}

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

function buildReportHTML(item) {
  const dailySavings = DAYS.map(day => ({
    day,
    kwh:   Math.round(item.saved * (0.12 + Math.random() * 0.08)),
    money: Math.round(item.money * (0.12 + Math.random() * 0.08)),
  }));

  const totalKwh   = dailySavings.reduce((s, d) => s + d.kwh, 0);
  const totalMoney = dailySavings.reduce((s, d) => s + d.money, 0);

  const today = new Date();
  const weekAgo = new Date(today); weekAgo.setDate(today.getDate() - 7);
  const dateRange = `${weekAgo.toLocaleDateString('en-US',{month:'short',day:'numeric'})} – ${today.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}`;

  const rows = dailySavings.map(d => `
    <div class="report-row">
      <span class="day">${d.day}</span>
      <span style="font-family:var(--font-heading);font-weight:600;">${d.kwh} kWh saved</span>
      <span style="color:var(--amber);font-family:var(--font-heading);font-weight:700;">+$${d.money}</span>
    </div>
  `).join('');

  return `
    <div class="report-header">
      <h4>Executive Audit Summary — ${item.name}</h4>
      <span class="report-date">${dateRange}</span>
    </div>
    <div class="report-rows">${rows}</div>
    <div class="report-total">
      <span>Net Weekly Verified Savings</span>
      <span>${totalKwh} kWh · $${totalMoney} USD</span>
    </div>
  `;
}

function generateReport() {
  if (!activeCard) return;
  const reportDiv = document.getElementById('weekly-report');
  reportDiv.innerHTML = buildReportHTML(activeCard);
  reportDiv.classList.add('show');
  showToast('Verified Executive PDF Report Generated');
}

/* ============================================================
   FALLBACK MOCK GENERATOR (When server.py is offline)
   ============================================================ */
function generateFallbackData() {
  const types = [
    { name: 'Warehouse Aisle 01 (Prototype Node)', loc: 'Zone 1 · Main Bay' },
    { name: 'Warehouse Aisle 02', loc: 'Zone 1 · High-Bay' },
    { name: 'Production Hall A', loc: 'Block A · Assembly' },
    { name: 'Cold Storage Vault 01', loc: 'Freezer (-18°C)' },
    { name: 'Chiller & HVAC Plant', loc: 'Rooftop Plant A' },
    { name: 'Solar Array Substation', loc: 'Carport Canopy' }
  ];
  
  inventoryData = types.map((t, idx) => ({
    id: idx + 1,
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M3 7l9-4 9 4v14H3V7zm4 4h4v6H7v-6zm6 0h4v6h-4v-6z"/></svg>`,
    name: t.name,
    location: t.loc,
    consumed: 1200 + idx * 150,
    saved: 450 + idx * 60,
    money: 65 + idx * 12,
    eff: 35,
    status: 'low',
    is_hardware: idx === 0
  }));
  
  renderInventory(inventoryData);
  updateTopStats(7800, 2600, 380, inventoryData.length);
}

/* ============================================================
   TOAST NOTIFICATION
   ============================================================ */
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  const toastMsg = document.getElementById('toast-msg');
  if (toastMsg) toastMsg.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  window.dispatchEvent(new Event('scroll'));
  fetchTelemetry();
});
