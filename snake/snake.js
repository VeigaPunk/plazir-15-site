(() => {
  "use strict";

  const COLS = 18;
  const ROWS = 14;
  const CELL_COUNT = COLS * ROWS;
  const START_LENGTH = 5;
  const SAVE_KEY = "plazir15.snake.v1";
  const SAVE_VERSION = 1;
  const SPEEDS = Object.freeze({ cruise: 24, rapid: 180, warp: 720 });
  const MANUAL_RATE = 9;
  const DIRECTIONS = Object.freeze({
    up: Object.freeze({ x: 0, y: -1 }),
    down: Object.freeze({ x: 0, y: 1 }),
    left: Object.freeze({ x: -1, y: 0 }),
    right: Object.freeze({ x: 1, y: 0 })
  });
  const DIRECTION_NAMES = new Map([
    ["0,-1", "↑ Up"],
    ["0,1", "↓ Down"],
    ["-1,0", "← Left"],
    ["1,0", "→ Right"]
  ]);

  const elements = {
    saveStatus: document.querySelector("#save-status"),
    statusLabel: document.querySelector("#status-label"),
    score: document.querySelector("#score"),
    canvas: document.querySelector("#game-canvas"),
    canvasWrap: document.querySelector("#canvas-wrap"),
    overlay: document.querySelector("#board-overlay"),
    overlayKicker: document.querySelector("#overlay-kicker"),
    overlayTitle: document.querySelector("#overlay-title"),
    overlayCopy: document.querySelector("#overlay-copy"),
    overlayAction: document.querySelector("#overlay-action"),
    fillCount: document.querySelector("#fill-count"),
    progressBar: document.querySelector("#progress-bar"),
    fillPercent: document.querySelector("#fill-percent"),
    modeButtons: [...document.querySelectorAll("[data-mode]")],
    decision: document.querySelector("#decision"),
    nextMove: document.querySelector("#next-move"),
    safetyGap: document.querySelector("#safety-gap"),
    routeState: document.querySelector("#route-state"),
    speedButtons: [...document.querySelectorAll("[data-speed]")],
    moveCount: document.querySelector("#move-count"),
    pauseButton: document.querySelector("#pause-button"),
    restartButton: document.querySelector("#restart-button"),
    bestFill: document.querySelector("#best-fill"),
    winCount: document.querySelector("#win-count"),
    directionButtons: [...document.querySelectorAll("[data-direction]")],
    dpadPause: document.querySelector("#dpad-pause"),
    liveStatus: document.querySelector("#live-status")
  };

  const ctx = elements.canvas.getContext("2d");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const hamiltonianCycle = buildHamiltonianCycle();
  const cycleIndex = new Map(hamiltonianCycle.map((cell, index) => [cellKey(cell), index]));
  verifyHamiltonianCycle(hamiltonianCycle);

  let storageEnabled = storageIsAvailable();
  let state;
  let records = { bestFill: START_LENGTH / CELL_COUNT, clears: 0 };
  let dirty = false;
  let uiDirty = true;
  let lastFrame = performance.now();
  let accumulator = 0;
  let touchStart = null;

  function cellKey(cell) {
    return `${cell.x},${cell.y}`;
  }

  function sameCell(a, b) {
    return Boolean(a && b && a.x === b.x && a.y === b.y);
  }

  function isInBounds(cell) {
    return cell.x >= 0 && cell.x < COLS && cell.y >= 0 && cell.y < ROWS;
  }

  function isCardinal(direction) {
    return Boolean(direction)
      && Number.isInteger(direction.x)
      && Number.isInteger(direction.y)
      && Math.abs(direction.x) + Math.abs(direction.y) === 1;
  }

  function orthogonallyAdjacent(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;
  }

  function buildHamiltonianCycle() {
    const route = [];

    for (let x = 0; x < COLS; x += 1) route.push({ x, y: 0 });

    for (let y = 1; y < ROWS; y += 1) {
      if (y % 2 === 1) {
        for (let x = COLS - 1; x >= 1; x -= 1) route.push({ x, y });
      } else {
        for (let x = 1; x < COLS; x += 1) route.push({ x, y });
      }
    }

    for (let y = ROWS - 1; y >= 1; y -= 1) route.push({ x: 0, y });

    const center = { x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) };
    const pivot = route.findIndex((cell) => sameCell(cell, center));
    return route.slice(pivot).concat(route.slice(0, pivot));
  }

  function verifyHamiltonianCycle(route) {
    if (route.length !== CELL_COUNT) throw new Error("Hamiltonian route has the wrong size.");
    const unique = new Set(route.map(cellKey));
    if (unique.size !== CELL_COUNT || route.some((cell) => !isInBounds(cell))) {
      throw new Error("Hamiltonian route does not cover the board exactly once.");
    }
    for (let index = 0; index < route.length; index += 1) {
      const next = route[(index + 1) % route.length];
      if (!orthogonallyAdjacent(route[index], next)) {
        throw new Error("Hamiltonian route is not a closed orthogonal cycle.");
      }
    }
  }

  function cycleDistance(from, to) {
    return (to - from + CELL_COUNT) % CELL_COUNT;
  }

  function isCycleOrdered(snake) {
    if (snake.length < 2) return true;
    let previous = cycleIndex.get(cellKey(snake[snake.length - 1]));
    let traveled = 0;

    for (let index = snake.length - 2; index >= 0; index -= 1) {
      const current = cycleIndex.get(cellKey(snake[index]));
      if (previous === undefined || current === undefined) return false;
      const advance = cycleDistance(previous, current);
      if (advance <= 0) return false;
      traveled += advance;
      if (traveled >= CELL_COUNT) return false;
      previous = current;
    }
    return true;
  }

  function nextRandom() {
    state.rng = (Math.imul(state.rng, 1664525) + 1013904223) >>> 0;
    return state.rng;
  }

  function placeFood() {
    const occupied = new Set(state.snake.map(cellKey));
    const empty = hamiltonianCycle.filter((cell) => !occupied.has(cellKey(cell)));
    if (empty.length === 0) return null;
    return { ...empty[nextRandom() % empty.length] };
  }

  function freshSeed() {
    const clock = Date.now() >>> 0;
    const timer = Math.floor(performance.now() * 1000) >>> 0;
    return (clock ^ timer ^ 0x50a715) >>> 0;
  }

  function createInitialState(mode = "auto", speed = "warp", userStarted = false) {
    const snake = [];
    for (let offset = 0; offset < START_LENGTH; offset += 1) {
      snake.push({ ...hamiltonianCycle[(CELL_COUNT - offset) % CELL_COUNT] });
    }
    const head = snake[0];
    const successor = hamiltonianCycle[1];
    const shouldPause = !userStarted && reducedMotion.matches;

    state = {
      dims: { cols: COLS, rows: ROWS },
      mode,
      status: shouldPause ? "paused" : "running",
      snake,
      food: null,
      direction: { x: successor.x - head.x, y: successor.y - head.y },
      queuedDirection: null,
      score: 0,
      moves: 0,
      speed: SPEEDS[speed] ? speed : "warp",
      rng: freshSeed(),
      decision: mode === "auto" ? "Cycle lock acquired" : "Human control ready",
      nextDirection: { x: successor.x - head.x, y: successor.y - head.y },
      safetyGap: CELL_COUNT - START_LENGTH
    };
    state.food = placeFood();
    accumulator = 0;
    updateRecords();
    markDirty();
    uiDirty = true;
  }

  function chooseAutopilotMove() {
    const head = state.snake[0];
    const tail = state.snake[state.snake.length - 1];
    const headIndex = cycleIndex.get(cellKey(head));
    const tailIndex = cycleIndex.get(cellKey(tail));
    const foodIndex = cycleIndex.get(cellKey(state.food));
    const tailDistance = cycleDistance(headIndex, tailIndex);
    const foodDistance = cycleDistance(headIndex, foodIndex);
    const fixedBody = new Set(state.snake.slice(0, -1).map(cellKey));
    const candidates = [];

    for (const direction of Object.values(DIRECTIONS)) {
      const cell = { x: head.x + direction.x, y: head.y + direction.y };
      if (!isInBounds(cell) || fixedBody.has(cellKey(cell))) continue;
      const destination = cycleIndex.get(cellKey(cell));
      const advance = cycleDistance(headIndex, destination);
      if (advance > 0 && advance < tailDistance && advance <= foodDistance) {
        candidates.push({ cell, direction, advance });
      }
    }

    candidates.sort((a, b) => b.advance - a.advance);
    let choice = candidates[0];

    if (!choice) {
      const cell = hamiltonianCycle[(headIndex + 1) % CELL_COUNT];
      const direction = { x: cell.x - head.x, y: cell.y - head.y };
      const blocked = fixedBody.has(cellKey(cell));
      if (!blocked) choice = { cell, direction, advance: 1 };
    }

    if (!choice) return null;
    return {
      ...choice,
      decision: choice.advance === 1 ? "Cycle lock · guarded" : `Safe shortcut · +${choice.advance - 1}`,
      safetyGap: Math.max(0, tailDistance - choice.advance)
    };
  }

  function stepGame() {
    if (state.status !== "running") return;

    let direction = state.direction;
    if (state.mode === "auto") {
      const plan = chooseAutopilotMove();
      if (!plan) {
        endRun("lost", "Autopilot route unavailable.");
        return;
      }
      direction = plan.direction;
      state.decision = plan.decision;
      state.nextDirection = { ...direction };
      state.safetyGap = plan.safetyGap;
    } else {
      if (state.queuedDirection) {
        direction = state.queuedDirection;
        state.queuedDirection = null;
      }
      state.decision = "Manual input · unguarded";
      state.nextDirection = { ...direction };
      state.safetyGap = Math.max(0, CELL_COUNT - state.snake.length);
    }

    state.direction = { ...direction };
    const head = state.snake[0];
    const next = { x: head.x + direction.x, y: head.y + direction.y };
    const willEat = sameCell(next, state.food);
    const bodyToCheck = willEat ? state.snake : state.snake.slice(0, -1);
    const collision = !isInBounds(next) || bodyToCheck.some((cell) => sameCell(cell, next));

    if (collision) {
      endRun("lost", "Collision detected. Start a new run to continue.");
      return;
    }

    state.snake.unshift(next);
    if (willEat) {
      state.score += 1;
      updateRecords();
      if (state.snake.length === CELL_COUNT) {
        state.food = null;
        records.clears += 1;
        records.bestFill = 1;
        endRun("won", "Every cell is occupied. Board cleared.");
      } else {
        state.food = placeFood();
      }
    } else {
      state.snake.pop();
    }

    state.moves += 1;
    updateRecords();
    markDirty();
    uiDirty = true;
  }

  function endRun(result, message) {
    state.status = result;
    accumulator = 0;
    updateRecords();
    markDirty();
    flushSave();
    uiDirty = true;
    announce(message);
  }

  function updateRecords() {
    if (!state) return;
    records.bestFill = Math.max(records.bestFill, state.snake.length / CELL_COUNT);
  }

  function queueDirection(direction) {
    if (!isCardinal(direction)) return;
    if (state.mode !== "manual") setMode("manual", true);
    if (state.status === "won" || state.status === "lost") createInitialState("manual", state.speed, true);
    if (state.status === "paused") resumeRun();
    if (state.queuedDirection) return;

    const current = state.direction;
    if (direction.x === -current.x && direction.y === -current.y) return;
    state.queuedDirection = { ...direction };
    state.decision = "Direction queued";
    state.nextDirection = { ...direction };
    markDirty();
    uiDirty = true;
  }

  function setMode(mode, fromDirection = false) {
    if (mode !== "manual" && mode !== "auto") return;
    if (state.mode === mode) return;

    if (mode === "auto") {
      createInitialState("auto", state.speed, true);
      announce("Autopilot engaged. A new safety-locked run has started.");
    } else {
      state.mode = "manual";
      state.queuedDirection = null;
      state.decision = fromDirection ? "Direction queued" : "Human control ready";
      if (state.status === "won" || state.status === "lost") {
        createInitialState("manual", state.speed, true);
      }
      markDirty();
      uiDirty = true;
      if (!fromDirection) announce("Manual controls engaged.");
    }
  }

  function togglePause() {
    if (state.status === "won" || state.status === "lost") {
      createInitialState(state.mode, state.speed, true);
      announce("New run started.");
      return;
    }
    if (state.status === "paused") {
      resumeRun();
    } else {
      state.status = "paused";
      accumulator = 0;
      markDirty();
      flushSave();
      uiDirty = true;
      announce("Run paused and saved on this device.");
    }
  }

  function resumeRun() {
    if (state.status !== "paused") return;
    state.status = "running";
    lastFrame = performance.now();
    accumulator = 0;
    markDirty();
    uiDirty = true;
    announce("Run resumed.");
  }

  function restartRun() {
    createInitialState(state.mode, state.speed, true);
    announce("New run started.");
  }

  function setSpeed(speed) {
    if (!SPEEDS[speed] || state.speed === speed) return;
    state.speed = speed;
    accumulator = 0;
    markDirty();
    uiDirty = true;
  }

  function announce(message) {
    elements.liveStatus.textContent = "";
    window.setTimeout(() => {
      elements.liveStatus.textContent = message;
    }, 20);
  }

  function markDirty() {
    dirty = true;
  }

  function storageIsAvailable() {
    try {
      const probe = `${SAVE_KEY}.probe`;
      window.localStorage.setItem(probe, "1");
      window.localStorage.removeItem(probe);
      return true;
    } catch (_error) {
      return false;
    }
  }

  function setSaveStatus(text, unavailable = false) {
    elements.saveStatus.classList.toggle("unsaved", unavailable);
    elements.saveStatus.lastChild.textContent = ` ${text}`;
  }

  function serializeState() {
    return {
      version: SAVE_VERSION,
      savedAt: new Date().toISOString(),
      speed: state.speed,
      records: { ...records },
      state: {
        dims: { cols: COLS, rows: ROWS },
        mode: state.mode,
        status: state.status,
        snake: state.snake.map((cell) => ({ ...cell })),
        food: state.food ? { ...state.food } : null,
        direction: { ...state.direction },
        score: state.score,
        moves: state.moves,
        rng: state.rng >>> 0
      }
    };
  }

  function flushSave() {
    if (!dirty || !state) return;
    if (!storageEnabled) {
      setSaveStatus("Session only", true);
      return;
    }
    try {
      window.localStorage.setItem(SAVE_KEY, JSON.stringify(serializeState()));
      dirty = false;
      setSaveStatus("Saved on this device");
    } catch (_error) {
      storageEnabled = false;
      setSaveStatus("Session only", true);
    }
  }

  function loadSave() {
    if (!storageEnabled) return false;
    let envelope;
    try {
      const raw = window.localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      envelope = JSON.parse(raw);
    } catch (_error) {
      return false;
    }
    if (!validateEnvelope(envelope)) return false;

    const saved = envelope.state;
    records = {
      bestFill: envelope.records.bestFill,
      clears: envelope.records.clears
    };
    state = {
      dims: { cols: COLS, rows: ROWS },
      mode: saved.mode,
      status: saved.status === "running" ? "paused" : saved.status,
      snake: saved.snake.map((cell) => ({ ...cell })),
      food: saved.food ? { ...saved.food } : null,
      direction: { ...saved.direction },
      queuedDirection: null,
      score: saved.score,
      moves: saved.moves,
      speed: envelope.speed,
      rng: saved.rng >>> 0,
      decision: "Local session restored",
      nextDirection: { ...saved.direction },
      safetyGap: Math.max(0, CELL_COUNT - saved.snake.length)
    };
    updateRecords();
    markDirty();
    flushSave();
    uiDirty = true;
    return true;
  }

  function validateEnvelope(envelope) {
    if (!envelope || envelope.version !== SAVE_VERSION || !envelope.state) return false;
    if (!SPEEDS[envelope.speed]) return false;
    if (!envelope.records
      || !Number.isFinite(envelope.records.bestFill)
      || envelope.records.bestFill < START_LENGTH / CELL_COUNT
      || envelope.records.bestFill > 1
      || !Number.isInteger(envelope.records.clears)
      || envelope.records.clears < 0) return false;

    const saved = envelope.state;
    if (!saved.dims || saved.dims.cols !== COLS || saved.dims.rows !== ROWS) return false;
    if (saved.mode !== "manual" && saved.mode !== "auto") return false;
    if (!["running", "paused", "won", "lost"].includes(saved.status)) return false;
    if (!Array.isArray(saved.snake) || saved.snake.length < START_LENGTH || saved.snake.length > CELL_COUNT) return false;
    if (!saved.snake.every(validCell)) return false;
    if (new Set(saved.snake.map(cellKey)).size !== saved.snake.length) return false;
    for (let index = 1; index < saved.snake.length; index += 1) {
      if (!orthogonallyAdjacent(saved.snake[index - 1], saved.snake[index])) return false;
    }
    if (!isCardinal(saved.direction)) return false;
    if (saved.snake.length > 1) {
      const heading = {
        x: saved.snake[0].x - saved.snake[1].x,
        y: saved.snake[0].y - saved.snake[1].y
      };
      if (!sameDirection(heading, saved.direction)) return false;
    }
    if (!Number.isInteger(saved.score) || saved.score !== saved.snake.length - START_LENGTH) return false;
    if (!Number.isInteger(saved.moves) || saved.moves < 0) return false;
    if (!Number.isInteger(saved.rng) || saved.rng < 0 || saved.rng > 0xffffffff) return false;
    if (saved.food !== null && (!validCell(saved.food) || saved.snake.some((cell) => sameCell(cell, saved.food)))) return false;
    if (saved.snake.length < CELL_COUNT && saved.food === null) return false;
    if (saved.snake.length === CELL_COUNT && (saved.food !== null || saved.status !== "won")) return false;
    if (saved.status === "won" && saved.snake.length !== CELL_COUNT) return false;
    if (saved.mode === "auto" && !isCycleOrdered(saved.snake)) return false;
    return true;
  }

  function validCell(cell) {
    return Boolean(cell) && Number.isInteger(cell.x) && Number.isInteger(cell.y) && isInBounds(cell);
  }

  function sameDirection(a, b) {
    return a.x === b.x && a.y === b.y;
  }

  function percentage(value) {
    return `${(value * 100).toFixed(1)}%`;
  }

  function refreshUI() {
    const fill = state.snake.length / CELL_COUNT;
    elements.score.textContent = String(state.score).padStart(3, "0");
    elements.fillCount.textContent = `${state.snake.length} / ${CELL_COUNT}`;
    elements.fillPercent.textContent = percentage(fill);
    elements.progressBar.style.width = percentage(fill);
    elements.moveCount.textContent = `${state.moves.toLocaleString()} ${state.moves === 1 ? "move" : "moves"}`;
    elements.bestFill.textContent = percentage(records.bestFill);
    elements.winCount.textContent = records.clears.toLocaleString();
    elements.decision.textContent = state.decision;
    elements.nextMove.textContent = DIRECTION_NAMES.get(`${state.nextDirection.x},${state.nextDirection.y}`) || "Holding";
    elements.safetyGap.textContent = `${state.safetyGap} ${state.safetyGap === 1 ? "cell" : "cells"}`;

    if (state.mode === "auto") {
      elements.routeState.textContent = "● Clear · safe";
      elements.routeState.classList.add("safe");
    } else {
      elements.routeState.textContent = "○ Manual · your call";
      elements.routeState.classList.remove("safe");
    }

    elements.modeButtons.forEach((button) => {
      const active = button.dataset.mode === state.mode;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    elements.speedButtons.forEach((button) => {
      const active = button.dataset.speed === state.speed;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    updateStatusControls();
    elements.canvas.setAttribute(
      "aria-label",
      `Snake board, ${state.snake.length} of ${CELL_COUNT} cells filled. ${state.mode === "auto" ? "Autopilot" : "Manual mode"}.`
    );
    uiDirty = false;
  }

  function updateStatusControls() {
    if (state.status === "running") {
      elements.statusLabel.textContent = state.mode === "auto" ? "Autopilot live" : "Manual control";
      elements.overlay.hidden = true;
      elements.pauseButton.innerHTML = "Pause <kbd>Space</kbd>";
      elements.dpadPause.textContent = "•";
      elements.dpadPause.setAttribute("aria-label", "Pause run");
      return;
    }

    elements.overlay.hidden = false;
    if (state.status === "paused") {
      elements.statusLabel.textContent = "Run paused";
      elements.overlayKicker.textContent = "Holding";
      elements.overlayTitle.textContent = "Run paused.";
      elements.overlayCopy.textContent = "The game clock and solver are frozen. Your session is saved locally.";
      elements.overlayAction.textContent = "Resume run";
      elements.pauseButton.innerHTML = "Resume <kbd>Space</kbd>";
      elements.dpadPause.textContent = "▶";
      elements.dpadPause.setAttribute("aria-label", "Resume run");
    } else if (state.status === "won") {
      elements.statusLabel.textContent = "Board cleared";
      elements.overlayKicker.textContent = "Full occupancy";
      elements.overlayTitle.textContent = "Every cell. Safe.";
      elements.overlayCopy.textContent = "The guarded route filled all 252 cells without a collision.";
      elements.overlayAction.textContent = "Run it again";
      elements.pauseButton.innerHTML = "New run <kbd>R</kbd>";
      elements.dpadPause.textContent = "↻";
      elements.dpadPause.setAttribute("aria-label", "Start a new run");
    } else {
      elements.statusLabel.textContent = "Run ended";
      elements.overlayKicker.textContent = "Collision detected";
      elements.overlayTitle.textContent = "That route closed.";
      elements.overlayCopy.textContent = "Manual runs are unguarded. Start fresh or hand control back to the solver.";
      elements.overlayAction.textContent = "Start a new run";
      elements.pauseButton.innerHTML = "New run <kbd>R</kbd>";
      elements.dpadPause.textContent = "↻";
      elements.dpadPause.setAttribute("aria-label", "Start a new run");
    }
  }

  function roundedRect(context, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + width, y, x + width, y + height, r);
    context.arcTo(x + width, y + height, x, y + height, r);
    context.arcTo(x, y + height, x, y, r);
    context.arcTo(x, y, x + width, y, r);
    context.closePath();
  }

  function render(timestamp) {
    if (!ctx) return;
    const rect = elements.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const pixelWidth = Math.round(rect.width * dpr);
    const pixelHeight = Math.round(rect.height * dpr);
    if (elements.canvas.width !== pixelWidth || elements.canvas.height !== pixelHeight) {
      elements.canvas.width = pixelWidth;
      elements.canvas.height = pixelHeight;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const width = rect.width;
    const height = rect.height;
    const cellWidth = width / COLS;
    const cellHeight = height / ROWS;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#061014";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(90, 168, 160, 0.075)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 1; x < COLS; x += 1) {
      const lineX = Math.round(x * cellWidth) + 0.5;
      ctx.moveTo(lineX, 0);
      ctx.lineTo(lineX, height);
    }
    for (let y = 1; y < ROWS; y += 1) {
      const lineY = Math.round(y * cellHeight) + 0.5;
      ctx.moveTo(0, lineY);
      ctx.lineTo(width, lineY);
    }
    ctx.stroke();

    ctx.fillStyle = state.mode === "auto" ? "rgba(90, 168, 160, 0.17)" : "rgba(197, 213, 220, 0.09)";
    const dotRadius = Math.max(0.6, Math.min(cellWidth, cellHeight) * 0.035);
    for (const cell of hamiltonianCycle) {
      ctx.beginPath();
      ctx.arc((cell.x + 0.5) * cellWidth, (cell.y + 0.5) * cellHeight, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    if (state.food) {
      const pulse = reducedMotion.matches ? 1 : 0.92 + Math.sin(timestamp / 180) * 0.08;
      const foodX = (state.food.x + 0.5) * cellWidth;
      const foodY = (state.food.y + 0.5) * cellHeight;
      const foodRadius = Math.min(cellWidth, cellHeight) * 0.25 * pulse;
      ctx.save();
      ctx.shadowColor = "rgba(217, 149, 90, 0.8)";
      ctx.shadowBlur = Math.min(cellWidth, cellHeight) * 0.65;
      ctx.fillStyle = "#d9955a";
      ctx.beginPath();
      ctx.arc(foodX, foodY, foodRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = "rgba(255, 234, 211, 0.9)";
      ctx.beginPath();
      ctx.arc(foodX - foodRadius * 0.28, foodY - foodRadius * 0.28, Math.max(1, foodRadius * 0.18), 0, Math.PI * 2);
      ctx.fill();
    }

    const inset = Math.max(1.25, Math.min(cellWidth, cellHeight) * 0.1);
    for (let index = state.snake.length - 1; index >= 0; index -= 1) {
      const cell = state.snake[index];
      const x = cell.x * cellWidth + inset;
      const y = cell.y * cellHeight + inset;
      const w = cellWidth - inset * 2;
      const h = cellHeight - inset * 2;
      const depth = state.snake.length > 1 ? 1 - index / (state.snake.length - 1) : 1;
      ctx.fillStyle = index === 0
        ? "#9ed7c4"
        : `rgba(${Math.round(72 + depth * 30)}, ${Math.round(122 + depth * 55)}, ${Math.round(103 + depth * 44)}, ${0.72 + depth * 0.26})`;
      if (index === 0) {
        ctx.save();
        ctx.shadowColor = "rgba(107, 170, 136, 0.62)";
        ctx.shadowBlur = Math.min(cellWidth, cellHeight) * 0.45;
      }
      roundedRect(ctx, x, y, w, h, Math.min(cellWidth, cellHeight) * 0.22);
      ctx.fill();
      if (index === 0) ctx.restore();
    }

    drawEyes(cellWidth, cellHeight, inset);
  }

  function drawEyes(cellWidth, cellHeight, inset) {
    const head = state.snake[0];
    if (!head) return;
    const direction = state.direction;
    const centerX = (head.x + 0.5) * cellWidth;
    const centerY = (head.y + 0.5) * cellHeight;
    const scale = Math.min(cellWidth, cellHeight);
    const forward = scale * 0.17;
    const side = scale * 0.14;
    const perpendicular = { x: -direction.y, y: direction.x };
    ctx.fillStyle = "#071014";
    for (const sign of [-1, 1]) {
      const eyeX = centerX + direction.x * forward + perpendicular.x * side * sign;
      const eyeY = centerY + direction.y * forward + perpendicular.y * side * sign;
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, Math.max(1, Math.min(scale * 0.055, inset * 0.75)), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function frame(timestamp) {
    const delta = Math.min(50, Math.max(0, timestamp - lastFrame));
    lastFrame = timestamp;

    if (state.status === "running") {
      const rate = state.mode === "auto" ? SPEEDS[state.speed] : MANUAL_RATE;
      accumulator += (delta * rate) / 1000;
      let steps = 0;
      while (accumulator >= 1 && steps < 40 && state.status === "running") {
        stepGame();
        accumulator -= 1;
        steps += 1;
      }
      if (steps === 40) accumulator = 0;
    } else {
      accumulator = 0;
    }

    if (uiDirty) refreshUI();
    render(timestamp);
    window.requestAnimationFrame(frame);
  }

  function handleCanvasKey(event) {
    const key = event.key.toLowerCase();
    const keyDirections = {
      arrowup: DIRECTIONS.up,
      w: DIRECTIONS.up,
      arrowdown: DIRECTIONS.down,
      s: DIRECTIONS.down,
      arrowleft: DIRECTIONS.left,
      a: DIRECTIONS.left,
      arrowright: DIRECTIONS.right,
      d: DIRECTIONS.right
    };
    if (keyDirections[key]) {
      event.preventDefault();
      queueDirection(keyDirections[key]);
    } else if (key === " " || key === "spacebar") {
      event.preventDefault();
      togglePause();
    } else if (key === "r") {
      event.preventDefault();
      restartRun();
    } else if (key === "g") {
      event.preventDefault();
      setMode(state.mode === "auto" ? "manual" : "auto");
    }
  }

  function bindControls() {
    elements.modeButtons.forEach((button) => {
      button.addEventListener("click", () => setMode(button.dataset.mode));
    });
    elements.speedButtons.forEach((button) => {
      button.addEventListener("click", () => setSpeed(button.dataset.speed));
    });
    elements.directionButtons.forEach((button) => {
      button.addEventListener("click", () => queueDirection(DIRECTIONS[button.dataset.direction]));
    });
    elements.pauseButton.addEventListener("click", togglePause);
    elements.dpadPause.addEventListener("click", togglePause);
    elements.overlayAction.addEventListener("click", togglePause);
    elements.restartButton.addEventListener("click", restartRun);
    elements.canvas.addEventListener("keydown", handleCanvasKey);

    elements.canvas.addEventListener("touchstart", (event) => {
      const touch = event.changedTouches[0];
      touchStart = { x: touch.clientX, y: touch.clientY };
    }, { passive: true });
    elements.canvas.addEventListener("touchmove", (event) => event.preventDefault(), { passive: false });
    elements.canvas.addEventListener("touchend", (event) => {
      if (!touchStart) return;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - touchStart.x;
      const dy = touch.clientY - touchStart.y;
      touchStart = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return;
      queueDirection(Math.abs(dx) > Math.abs(dy)
        ? (dx > 0 ? DIRECTIONS.right : DIRECTIONS.left)
        : (dy > 0 ? DIRECTIONS.down : DIRECTIONS.up));
    }, { passive: true });

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") flushSave();
    });
    window.addEventListener("pagehide", flushSave);
  }

  bindControls();
  const restored = loadSave();
  if (!restored) {
    createInitialState("auto", "warp", false);
    flushSave();
  }
  if (!storageEnabled) setSaveStatus("Session only", true);
  refreshUI();
  render(performance.now());
  window.setInterval(flushSave, 1000);
  window.requestAnimationFrame(frame);
})();
