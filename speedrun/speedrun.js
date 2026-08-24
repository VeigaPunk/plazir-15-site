function el(id) { return document.getElementById(id); }
async function loadJson(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`${path} ${res.status}`);
  return res.json();
}
async function loadJsonSoft(path) {
  try { return await loadJson(path); } catch (e) { return null; }
}
function escapeHtml(s) {
  return String(s ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
function budgetCell(run) {
  return run.budget_usd != null ? `$${run.budget_usd}` : "paid";
}
function renderTimeline(node, steps) {
  node.innerHTML = "";
  for (const step of steps || []) {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${escapeHtml(step.label)}</strong> — ${escapeHtml(step.note)}`;
    node.appendChild(li);
  }
}
function fmtTokens(n) {
  if (n == null) return "—";
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}k`;
  return String(n);
}
function renderFeatured(run) {
  const m = run.metrics || {};
  el("run-title").textContent = `${run.runner} — $${run.budget_usd} · ${run.duration}`;
  el("run-summary").textContent = run.summary;
  renderTimeline(el("run-timeline"), run.timeline);
  el("run-metrics").innerHTML = `
    <dt>provider</dt><dd>${escapeHtml(run.provider)}</dd>
    <dt>mode</dt><dd>${escapeHtml(m.mode || "—")} · ${escapeHtml(m.parallelization || "—")}</dd>
    <dt>clock</dt><dd>${escapeHtml(m.wall_clock_hours ?? run.duration)} h</dd>
  `;
}
function renderKimi(run) {
  const m = run.metrics || {};
  el("kimi-title").textContent = `${run.runner} — ${run.title}`;
  el("kimi-summary").textContent = run.summary;
  renderTimeline(el("kimi-timeline"), run.timeline);
  el("kimi-metrics").innerHTML = `
    <dt>status</dt><dd class="status-live">${escapeHtml(run.status)}</dd>
    <dt>cron</dt><dd>${escapeHtml(m.cron_job || "01M0S354HTM81Q9NCNM36MSQAD")} · ${escapeHtml(m.cron_schedule || "11,41 * * * *")}</dd>
    <dt>quota</dt><dd>weekly ${escapeHtml(m.weekly_pct)}% · 5h ${escapeHtml(m.fiveh_pct)}%</dd>
    <dt>context</dt><dd>${escapeHtml(m.context_frac)}</dd>
  `;
}
function renderCurve(curve) {
  const pts = curve.points || [];
  if (!pts.length) return;
  const t0 = new Date(curve.t0).getTime();
  const xs = pts.map((p) => (new Date(p.ts).getTime() - t0) / 60000);
  const maxX = Math.max(xs.at(-1), 1);
  const x0 = 16, x1 = 624, y1 = 196, y0 = 12;
  const X = (x) => x0 + (x / maxX) * (x1 - x0);
  const Y = (y) => y1 - (y / 100) * (y1 - y0);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${X(xs[i]).toFixed(1)},${Y(p.pct).toFixed(1)}`).join(" ");
  const lastX = X(xs.at(-1)), lastY = Y(pts.at(-1).pct);
  el("curve-line").setAttribute("d", line);
  el("curve-fill").setAttribute("d", `${line} L${lastX.toFixed(1)},${y1} L${X(xs[0]).toFixed(1)},${y1} Z`);
  el("curve-dot").setAttribute("cx", lastX.toFixed(1));
  el("curve-dot").setAttribute("cy", lastY.toFixed(1));
}
function renderCodex(run, curve) {
  const m = run.metrics || {};
  const pace = run.pace || {};
  const pct = m.used_percent ?? 0;
  el("live-title").textContent = `${run.runner} — ${run.title}`;
  el("live-summary").textContent = run.summary;
  el("live-pct").textContent = `${pct}%`;
  el("hero-live-pct").textContent = `${pct}%`;
  el("live-fill").style.width = `${Math.min(100, Number(pct) || 0)}%`;
  el("live-pace").textContent = `${pace.pct_per_min ?? "—"}%/min`;
  el("live-eta").textContent = `${pace.eta_100_min ?? "—"} min`;
  const rec = el("live-record");
  const ok = pace.subhour_ok;
  rec.textContent = ok ? "yes" : "no";
  rec.className = ok ? "yes" : "no";
  el("live-metrics").innerHTML = `
    <dt>meter</dt><dd>weekly ${escapeHtml(m.window_minutes)} min</dd>
    <dt>tokens</dt><dd>${fmtTokens(m.tokens_total)}</dd>
    <dt>rollouts</dt><dd>${escapeHtml(m.n_rollouts)}</dd>
  `;
  if (curve) renderCurve(curve);
}
function renderBoard(runs) {
  el("hero-n-runs").textContent = String(runs.length);
  el("board-body").innerHTML = runs.map((run, i) => {
    const st = run.status === "live" ? "status-live" : "status-closed";
    return `<tr>
      <td>${i + 1}</td>
      <td>${escapeHtml(run.runner)}</td>
      <td>${escapeHtml(run.provider || "—")}</td>
      <td>${escapeHtml(budgetCell(run))}</td>
      <td>${escapeHtml(run.duration || "—")}</td>
      <td class="${st}">${escapeHtml(run.status)}</td>
    </tr>`;
  }).join("");
}
async function main() {
  const manifest = await loadJson("data/manifest.json");
  const runs = (await Promise.all((manifest.runs || []).map(loadJsonSoft))).filter(Boolean);
  if (runs.length) renderBoard(runs);
  const byId = Object.fromEntries(runs.map((r) => [r.id, r]));
  const featured = byId[manifest.featured_run_id];
  if (featured) renderFeatured(featured);
  const kimi = byId["veigapunk-kimi-vivace-oauth-2026-08-24"];
  if (kimi) renderKimi(kimi);
  const codex = byId[manifest.live_strip_run_id];
  const curve = await loadJsonSoft("data/codex-curve.json");
  if (codex) renderCodex(codex, curve);
}
main().catch((err) => { if (el("run-summary")) el("run-summary").textContent = err.message; });
