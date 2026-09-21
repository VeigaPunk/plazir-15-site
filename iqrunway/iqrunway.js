const byId = (id) => document.getElementById(id);
const allowedStatuses = new Set(["live", "completed", "stopped", "blocked", "not-scored", "not-started"]);

function node(tag, options = {}, children = []) {
  const element = document.createElement(tag);
  if (options.className) element.className = options.className;
  if (options.text != null) element.textContent = String(options.text);
  if (options.id) element.id = options.id;
  for (const [name, value] of Object.entries(options.attrs || {})) {
    element.setAttribute(name, value);
  }
  for (const child of children) element.append(child);
  return element;
}

function statusBadge(status) {
  const safeStatus = allowedStatuses.has(status) ? status : "not-scored";
  return node("span", {
    className: `status status-${safeStatus}`,
    text: safeStatus.replaceAll("-", " ")
  });
}

function formatSeconds(value) {
  if (!Number.isFinite(value)) return "—";
  const seconds = Math.max(0, Math.round(value));
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return minutes ? `${minutes}m ${remainder}s` : `${remainder}s`;
}

function overallScore(run) {
  return run.score?.overall?.value == null ? "Not scored —" : String(run.score.overall.value);
}

function ageLabel(run) {
  const age = run.age || {};
  if (age.appliedOnSite === true) return `${age.targetYears} applied`;
  return `target ${age.targetYears ?? "—"} · not applied`;
}

function routeLabel(run) {
  const route = run.route || {};
  if (!route.served) return "—";
  return route.fallback === true ? `${route.served} · fallback` : `${route.served} · direct`;
}

function fact(term, description) {
  return node("div", {}, [node("dt", { text: term }), node("dd", { text: description })]);
}

function renderBoard(runs) {
  const body = byId("board-body");
  body.replaceChildren();

  for (const run of runs) {
    const modelCell = node("td", { className: "model-cell" }, [
      node("strong", { text: run.model?.observed || run.model?.label || "Unknown model" }),
      node("a", { text: run.title || run.id, attrs: { href: `#${run.id}` } })
    ]);

    const score = overallScore(run);
    const scoreCell = node("td", { className: score === "Not scored —" ? "missing" : "", text: score });
    const routeCell = node("td", { className: "route-cell" }, [
      node("span", { text: routeLabel(run) }),
      node("small", { text: `requested: ${run.route?.requested || "—"}` })
    ]);

    body.append(node("tr", {}, [
      modelCell,
      node("td", { text: `${run.battery?.label || "—"} · ${run.battery?.completedSubtests ?? "—"}/${run.battery?.plannedSubtests ?? "—"}` }),
      scoreCell,
      node("td", { text: ageLabel(run) }),
      routeCell,
      node("td", { text: `${formatSeconds(run.protocolTime?.elapsedSeconds)} · agent + browser` }),
      node("td", {}, [statusBadge(run.status)])
    ]));
  }

  byId("board-wrap").hidden = false;
}

function renderSubtest(subtest) {
  const scoreAvailable = subtest.siteScore?.value != null;
  const scoreLine = scoreAvailable
    ? node("p", { className: "score-line" }, [
        node("strong", { text: subtest.siteScore.value }),
        document.createTextNode(` site-reported ${subtest.name} score${subtest.siteScore.label ? ` · site label: ${subtest.siteScore.label}` : ""}`)
      ])
    : node("p", { className: "score-line missing", text: "Not scored — no site score returned" });

  const details = [];
  if (Number.isFinite(subtest.attempted)) details.push(`${subtest.attempted} attempted`);
  if (Number.isFinite(subtest.blank)) details.push(`${subtest.blank} blank`);
  if (Number.isFinite(subtest.elapsedSeconds)) details.push(`${formatSeconds(subtest.elapsedSeconds)} agent + browser protocol clock`);

  return node("article", { className: "subtest" }, [
    node("div", { className: "subtest-head" }, [
      node("h4", { text: subtest.name }),
      statusBadge(subtest.status)
    ]),
    scoreLine,
    node("p", { className: "subtest-note", text: details.length ? details.join(" · ") : "No completion metrics available" })
  ]);
}

function renderRun(run) {
  const scoreText = run.score?.overall?.value == null
    ? "Not scored — no overall battery score was returned"
    : `${run.score.overall.value} · ${run.score.overall.provenance || "source result"}`;
  const age = run.age || {};
  const ageText = age.appliedOnSite
    ? `${age.targetYears} applied · ${age.scope || "site form"}`
    : `target ${age.targetYears ?? "—"} · not applied`;
  const route = run.route || {};
  const routeText = `requested ${route.requested || "—"} → observed ${route.served || "—"} · ${route.fallback ? "fallback" : "no fallback"}`;
  const timeText = Number.isFinite(run.protocolTime?.elapsedSeconds)
    ? `${formatSeconds(run.protocolTime.elapsedSeconds)} · ${run.protocolTime.scope}`
    : `Unavailable · ${run.protocolTime?.scope || "no elapsed protocol time returned"}`;

  const subtests = node("div", { className: "subtests" });
  for (const subtest of run.subtests || []) subtests.append(renderSubtest(subtest));

  return node("article", { className: "run-card", id: run.id }, [
    node("div", { className: "run-card-head" }, [
      node("div", {}, [
        node("p", { className: "eyebrow", text: `${run.observedAt || "date unavailable"} · ${run.battery?.label || "battery unavailable"}` }),
        node("h3", { text: run.title || run.model?.label || "Untitled run" })
      ]),
      statusBadge(run.status)
    ]),
    node("p", { className: "run-summary", text: run.summary }),
    node("dl", { className: "run-facts" }, [
      fact("Observed model", run.model?.observed || run.model?.label || "—"),
      fact("Battery / progress", `${run.battery?.label || "—"} · ${run.battery?.completedSubtests ?? "—"}/${run.battery?.plannedSubtests ?? "—"}`),
      fact("Overall score", scoreText),
      fact("Age", ageText),
      fact("Requested / served route", routeText),
      fact("Protocol elapsed", timeText)
    ]),
    node("h4", { className: "subtests-title", text: "Subtest completion and site-visible outcome" }),
    subtests,
    node("p", { className: "provenance" }, [
      node("strong", { text: "Comparability: " }),
      document.createTextNode(`${run.provenance?.comparability || "Not established"}. `),
      node("strong", { text: "Public record: " }),
      document.createTextNode(run.provenance?.note || "Metadata and outcome summary only.")
    ])
  ]);
}

function renderRuns(runs) {
  const panels = byId("run-panels");
  panels.replaceChildren();
  for (const run of runs) panels.append(renderRun(run));
}

function renderSummary(runs) {
  byId("run-count").textContent = String(runs.length);
  byId("score-count").textContent = String(runs.filter((run) => run.score?.overall?.value != null).length);
}

function showError(error) {
  const state = byId("load-state");
  state.className = "load-state error";
  state.replaceChildren(document.createTextNode("Run data could not be loaded. The board will not guess at missing results."));
  const retry = node("button", { className: "retry", text: "Retry", attrs: { type: "button" } });
  retry.addEventListener("click", loadBoard, { once: true });
  state.append(retry);
  console.error("IQRUNWAY data load failed", error);
}

async function loadBoard() {
  const state = byId("load-state");
  state.className = "load-state";
  state.textContent = "Loading public run data…";

  try {
    const response = await fetch("data/runs.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`data/runs.json returned ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data.runs)) throw new Error("data/runs.json has no runs array");

    const runs = [...data.runs].sort((a, b) => String(b.updatedAt || b.observedAt).localeCompare(String(a.updatedAt || a.observedAt)));
    renderSummary(runs);
    renderBoard(runs);
    renderRuns(runs);
    state.textContent = runs.length
      ? `${runs.length} public run${runs.length === 1 ? "" : "s"} loaded. Rows are latest-updated first, not ranked.`
      : "No public-safe runs yet. Method and data boundaries remain available below.";
  } catch (error) {
    showError(error);
  }
}

loadBoard();
