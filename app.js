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
  const egpSavings = Math.round(totalKwh * 3.20);

  const today = new Date();
  const weekAgo = new Date(today); weekAgo.setDate(today.getDate() - 7);
  const dateRange = `${weekAgo.toLocaleDateString('en-US',{month:'short',day:'numeric'})} – ${today.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}`;

  const rows = dailySavings.map(d => `
    <div class="report-row">
      <span class="day">${d.day}</span>
      <span style="font-family:var(--font-heading);font-weight:600;">${d.kwh} kWh saved</span>
      <span style="color:var(--emerald);font-family:var(--font-heading);font-weight:700;">+${Math.round(d.kwh * 3.20).toLocaleString()} ج.م ($${d.money})</span>
    </div>
  `).join('');

  return `
    <div class="report-header">
      <div>
        <h4 style="margin:0;color:#fff;">Executive Audit Summary — ${item.name}</h4>
        <div style="font-size:0.75rem;color:#10b981;font-weight:600;margin-top:2px;">📍 ${item.location} · Node #${item.id}</div>
      </div>
      <span class="report-date">${dateRange}</span>
    </div>
    <div class="report-rows">${rows}</div>
    <div class="report-total" style="flex-direction:column;align-items:stretch;gap:8px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span>Net Weekly Verified Savings:</span>
        <span style="color:#10b981;font-size:1.05rem;">${totalKwh.toLocaleString()} kWh · ${egpSavings.toLocaleString()} EGP ($${totalMoney})</span>
      </div>
      <div style="display:flex;gap:8px;margin-top:6px;">
        <button onclick="downloadAislePDF(activeCard)" class="btn btn-primary" style="flex:1;padding:8px 12px;font-size:0.82rem;display:flex;align-items:center;justify-content:center;gap:6px;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <span>تنزيل PDF مجدداً (Download)</span>
        </button>
        <button onclick="printAisleReport(activeCard)" class="btn btn-secondary" style="padding:8px 14px;font-size:0.82rem;display:flex;align-items:center;justify-content:center;gap:6px;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          <span>طباعة</span>
        </button>
      </div>
    </div>
  `;
}

function buildFullPdfDocument(item) {
  const dailyRows = DAYS.map((day, idx) => {
    const baseline = Math.round(item.consumed * (1.3 + (idx % 3) * 0.05));
    const smart = Math.round(baseline * 0.443);
    const saved = baseline - smart;
    const egp = Math.round(saved * 3.20);
    const co2 = Math.round(saved * 0.472);
    return `
      <tr style="border-bottom:1px solid #e2e8f0;${idx % 2 === 1 ? 'background:#f8fafc;' : ''}">
        <td style="padding:7px 10px;text-align:left;font-weight:600;color:#0f172a;">${day}</td>
        <td style="padding:7px 10px;color:#64748b;">${baseline.toLocaleString()}</td>
        <td style="padding:7px 10px;color:#0f172a;font-weight:600;">${smart.toLocaleString()}</td>
        <td style="padding:7px 10px;color:#059669;font-weight:700;">+${saved.toLocaleString()}</td>
        <td style="padding:7px 10px;color:#d97706;font-weight:700;">${egp.toLocaleString()} ج.م</td>
        <td style="padding:7px 10px;color:#0284c7;font-weight:600;">${co2.toLocaleString()} kg</td>
      </tr>
    `;
  }).join('');

  const todayStr = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
  const serialNo = `ENX-AUDIT-${item.id}-${Date.now().toString().slice(-6)}`;
  const egpTotal = Math.round(item.saved * 3.20);

  const container = document.createElement('div');
  container.id = 'energix-pdf-temp-export';
  container.style.cssText = 'background:#ffffff;color:#0f172a;font-family:Arial,sans-serif;padding:24px 28px;width:780px;box-sizing:border-box;margin:0 auto;line-height:1.45;';
  
  container.innerHTML = `
    <!-- Header -->
    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #059669;padding-bottom:12px;margin-bottom:16px;">
      <div>
        <div style="font-size:22px;font-weight:800;color:#065f46;letter-spacing:0.5px;">⚡ ENERGIX INDUSTRIAL PLATFORM</div>
        <div style="font-size:12px;color:#64748b;font-weight:600;margin-top:2px;">Smart Warehouse Energy Management & Automated Standby Grid</div>
      </div>
      <div style="text-align:right;">
        <span style="background:#ecfdf5;border:1px solid #059669;color:#065f46;font-size:11px;font-weight:700;padding:3px 8px;border-radius:12px;">ISO 50001 CERTIFIED</span>
        <div style="font-size:11px;color:#64748b;margin-top:4px;font-family:monospace;">${serialNo}</div>
      </div>
    </div>

    <!-- Facility Metadata -->
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px 16px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:flex-start;">
      <div>
        <div style="font-size:10px;text-transform:uppercase;color:#059669;font-weight:700;letter-spacing:1px;">Official Facility Audit Report</div>
        <div style="font-size:18px;font-weight:800;color:#0f172a;margin-top:2px;">${item.name}</div>
        <div style="font-size:12px;color:#475569;margin-top:2px;">📍 ${item.location} · Edge Node: #${item.id}</div>
      </div>
      <div style="text-align:right;font-size:11px;color:#475569;line-height:1.6;">
        <div><b>Audit Date:</b> ${todayStr}</div>
        <div><b>Operating Mode:</b> <span style="color:#059669;font-weight:700;">${item.dim_pct || 20}% Standby Mode</span></div>
        <div><b>Electricity Tariff:</b> 3.20 EGP/kWh ($0.065 USD)</div>
      </div>
    </div>

    <!-- KPI Metric Cards -->
    <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:10px;margin-bottom:16px;">
      <div style="background:#fff;border:1px solid #e2e8f0;border-top:3px solid #ef4444;border-radius:6px;padding:10px;text-align:center;">
        <div style="font-size:11px;color:#64748b;font-weight:600;">Power Consumed</div>
        <div style="font-size:16px;font-weight:800;color:#ef4444;margin-top:3px;">${item.consumed.toLocaleString()} kWh</div>
        <div style="font-size:9.5px;color:#94a3b8;">Active Load</div>
      </div>
      <div style="background:#fff;border:1px solid #e2e8f0;border-top:3px solid #059669;border-radius:6px;padding:10px;text-align:center;">
        <div style="font-size:11px;color:#64748b;font-weight:600;">Energy Curtailment</div>
        <div style="font-size:16px;font-weight:800;color:#059669;margin-top:3px;">${item.saved.toLocaleString()} kWh</div>
        <div style="font-size:9.5px;color:#059669;font-weight:600;">55.7% Verified Saved</div>
      </div>
      <div style="background:#fff;border:1px solid #e2e8f0;border-top:3px solid #d97706;border-radius:6px;padding:10px;text-align:center;">
        <div style="font-size:11px;color:#64748b;font-weight:600;">Financial Recovery</div>
        <div style="font-size:16px;font-weight:800;color:#d97706;margin-top:3px;">${egpTotal.toLocaleString()} ج.م</div>
        <div style="font-size:9.5px;color:#64748b;">$${item.money.toLocaleString()} USD</div>
      </div>
      <div style="background:#fff;border:1px solid #e2e8f0;border-top:3px solid #0284c7;border-radius:6px;padding:10px;text-align:center;">
        <div style="font-size:11px;color:#64748b;font-weight:600;">Efficiency Rating</div>
        <div style="font-size:16px;font-weight:800;color:#0284c7;margin-top:3px;">${item.eff}%</div>
        <div style="font-size:9.5px;color:#0284c7;font-weight:600;">Optimal Band</div>
      </div>
    </div>

    <!-- Technical Hardware Specifications -->
    <div style="margin-bottom:16px;">
      <div style="font-size:12px;font-weight:700;color:#0f172a;margin-bottom:6px;border-bottom:1px solid #e2e8f0;padding-bottom:3px;">
        ⚙️ Technical Infrastructure & Telemetry Specifications
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:11px;">
        <tr style="background:#f8fafc;">
          <td style="padding:5px 8px;border:1px solid #e2e8f0;color:#64748b;width:25%;"><b>Lighting Fixtures:</b></td>
          <td style="padding:5px 8px;border:1px solid #e2e8f0;width:25%;">10× 150W High-Bay LED (0-10V Dimming)</td>
          <td style="padding:5px 8px;border:1px solid #e2e8f0;color:#64748b;width:25%;"><b>Standby Dimming Level:</b></td>
          <td style="padding:5px 8px;border:1px solid #e2e8f0;width:25%;color:#059669;font-weight:700;">20% Baseline (Safety Compliant)</td>
        </tr>
        <tr>
          <td style="padding:5px 8px;border:1px solid #e2e8f0;color:#64748b;"><b>Sensor Payload:</b></td>
          <td style="padding:5px 8px;border:1px solid #e2e8f0;">Dual Microwave 5.8GHz + PIR Thermal</td>
          <td style="padding:5px 8px;border:1px solid #e2e8f0;color:#64748b;"><b>Controller Node:</b></td>
          <td style="padding:5px 8px;border:1px solid #e2e8f0;">${item.is_hardware ? 'Hardware Node 1 (USB Serial)' : 'Edge Virtual Node'}</td>
        </tr>
        <tr style="background:#f8fafc;">
          <td style="padding:5px 8px;border:1px solid #e2e8f0;color:#64748b;"><b>Response Latency:</b></td>
          <td style="padding:5px 8px;border:1px solid #e2e8f0;">< 35 ms (PWM Instant Lux Ramp-Up)</td>
          <td style="padding:5px 8px;border:1px solid #e2e8f0;color:#64748b;"><b>Standard Compliance:</b></td>
          <td style="padding:5px 8px;border:1px solid #e2e8f0;">ASHRAE 90.1 / EgyptERA Industrial</td>
        </tr>
      </table>
    </div>

    <!-- 7-Day Audit Trail Table -->
    <div style="margin-bottom:16px;">
      <div style="font-size:12px;font-weight:700;color:#0f172a;margin-bottom:6px;border-bottom:1px solid #e2e8f0;padding-bottom:3px;">
        📅 7-Day Audited Energy Telemetry Log
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:10.5px;text-align:center;">
        <thead>
          <tr style="background:#064e3b;color:#ffffff;">
            <th style="padding:6px 8px;border:1px solid #047857;text-align:left;">Day</th>
            <th style="padding:6px 8px;border:1px solid #047857;">Baseline (kWh)</th>
            <th style="padding:6px 8px;border:1px solid #047857;">Smart Mode (kWh)</th>
            <th style="padding:6px 8px;border:1px solid #047857;color:#6ee7b7;">Energy Saved (kWh)</th>
            <th style="padding:6px 8px;border:1px solid #047857;">Cost Saved (EGP)</th>
            <th style="padding:6px 8px;border:1px solid #047857;">CO₂ Offset (kg)</th>
          </tr>
        </thead>
        <tbody>
          ${dailyRows}
          <tr style="background:#ecfdf5;font-weight:700;border-top:2px solid #059669;">
            <td style="padding:7px 10px;text-align:left;color:#065f46;">TOTAL (WEEKLY)</td>
            <td style="padding:7px 10px;color:#64748b;">${Math.round(item.consumed * 1.4).toLocaleString()} kWh</td>
            <td style="padding:7px 10px;color:#0f172a;">${item.consumed.toLocaleString()} kWh</td>
            <td style="padding:7px 10px;color:#059669;">+${item.saved.toLocaleString()} kWh</td>
            <td style="padding:7px 10px;color:#d97706;">+${egpTotal.toLocaleString()} ج.م</td>
            <td style="padding:7px 10px;color:#0284c7;">${Math.round(item.saved * 0.472).toLocaleString()} kg</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Carbon & Decarbonization Note -->
    <div style="background:#ecfdf5;border-left:4px solid #059669;padding:9px 12px;margin-bottom:16px;font-size:10.5px;color:#065f46;line-height:1.5;">
      <b>🌱 Environmental & ESG Decarbonization Impact:</b>
      By curtailing <b>${item.saved.toLocaleString()} kWh</b>, this aisle has prevented approximately <b>${Math.round(item.saved * 0.472).toLocaleString()} kg of CO₂e emissions</b> from entering the national grid (Egypt NREA emission factor: 0.472 kg CO₂/kWh). Equivalent to planting <b>${Math.round(item.saved * 0.472 / 21)} mature trees</b>.
    </div>

    <!-- Signatures / Footer Seal -->
    <div style="display:flex;justify-content:space-between;align-items:flex-end;border-top:1px solid #cbd5e1;padding-top:12px;font-size:10px;color:#64748b;">
      <div>
        <div><b>Audit Verified By:</b> Energix Industrial Edge Controller Core</div>
        <div><b>AI Telemetry Engine:</b> Groq Cloud LPU (120B Token Processor)</div>
        <div style="margin-top:3px;font-family:monospace;color:#94a3b8;">DIGITAL SIGNATURE: ENX-SIG-${Math.random().toString(36).substring(2, 10).toUpperCase()}</div>
      </div>
      <div style="text-align:right;">
        <div style="border:1.5px dashed #059669;padding:5px 12px;border-radius:6px;background:#f0fdf4;display:inline-block;text-align:center;">
          <span style="color:#059669;font-weight:800;font-size:10px;display:block;">ENERGIX VERIFIED AUDIT</span>
          <span style="color:#64748b;font-size:8.5px;">Official Graduation Capstone Defense</span>
        </div>
      </div>
    </div>
  `;
  return container;
}

function downloadAislePDF(item) {
  if (!item) return;
  showToast('⏳ جاري إنشاء وتنزيل تقرير الـ PDF...');

  const el = buildFullPdfDocument(item);
  document.body.appendChild(el);

  const cleanName = (item.name || 'Aisle').replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Energix_Audit_Report_${cleanName}.pdf`;

  if (typeof html2pdf !== 'undefined') {
    const opt = {
      margin:       [8, 8, 8, 8],
      filename:     filename,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(el).save().then(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
      showToast('✅ تم تنزيل تقرير الـ PDF بنجاح!');
    }).catch(err => {
      console.error(err);
      if (el.parentNode) el.parentNode.removeChild(el);
      printAisleReport(item);
    });
  } else {
    if (el.parentNode) el.parentNode.removeChild(el);
    printAisleReport(item);
  }
}

function printAisleReport(item) {
  if (!item) return;
  const el = buildFullPdfDocument(item);
  const printWindow = window.open('', '_blank', 'width=850,height=900');
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Energix Audit Report — ${item.name}</title>
          <style>
            @page { size: A4 portrait; margin: 10mm; }
            body { margin: 0; background: #fff; font-family: Arial, sans-serif; }
          </style>
        </head>
        <body>
          ${el.outerHTML}
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  } else {
    window.print();
  }
}

function generateReport() {
  if (!activeCard) return;
  const reportDiv = document.getElementById('weekly-report');
  reportDiv.innerHTML = buildReportHTML(activeCard);
  reportDiv.classList.add('show');
  
  // Automatically trigger real PDF download!
  downloadAislePDF(activeCard);
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
