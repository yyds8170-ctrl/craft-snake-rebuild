// UI 层：负责 DOM、渲染、定时器与本地最高分；游戏逻辑见 engine.js
import {
  createInitialState, setDirection, step, currentSpeed,
} from "./engine.js";

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const GRID = 20;
const CELLS = canvas.width / GRID;

const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlayText = document.getElementById("overlay-text");
const startBtn = document.getElementById("start-btn");

let state, timer, running, paused;
let best = Number(localStorage.getItem("snake_best") || 0);
bestEl.textContent = best;

function reset() {
  state = createInitialState(CELLS);
  scoreEl.textContent = 0;
  draw();
}

function tick() {
  const event = step(state);
  if (event === "over") return gameOver();

  scoreEl.textContent = state.score;
  if (state.score > best) {
    best = state.score;
    bestEl.textContent = best;
    localStorage.setItem("snake_best", String(best));
  }
  if (event === "ate") restartTimer(); // 速度可能变化
  draw();
}

function draw() {
  ctx.fillStyle = getCss("--panel");
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = getCss("--grid");
  ctx.lineWidth = 1;
  for (let i = 1; i < CELLS; i++) {
    ctx.beginPath(); ctx.moveTo(i * GRID, 0); ctx.lineTo(i * GRID, canvas.height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i * GRID); ctx.lineTo(canvas.width, i * GRID); ctx.stroke();
  }

  ctx.fillStyle = getCss("--food");
  roundCell(state.food.x, state.food.y, 5);

  state.snake.forEach((seg, i) => {
    ctx.fillStyle = i === 0 ? getCss("--snake-head") : getCss("--snake");
    roundCell(seg.x, seg.y, 4);
  });
}

function roundCell(x, y, r) {
  const px = x * GRID + 1, py = y * GRID + 1, size = GRID - 2;
  ctx.beginPath();
  ctx.roundRect(px, py, size, size, r);
  ctx.fill();
}

function getCss(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function restartTimer() {
  clearInterval(timer);
  timer = setInterval(tick, currentSpeed(state.score));
}

function start() {
  reset();
  running = true;
  paused = false;
  overlay.classList.add("hidden");
  restartTimer();
}

function gameOver() {
  clearInterval(timer);
  running = false;
  overlayTitle.textContent = "游戏结束";
  overlayText.textContent = `本局得分 ${state.score}，再来一局？`;
  startBtn.textContent = "重新开始";
  overlay.classList.remove("hidden");
}

function togglePause() {
  if (!running) { start(); return; }
  paused = !paused;
  if (paused) {
    clearInterval(timer);
    overlayTitle.textContent = "已暂停";
    overlayText.textContent = "按空格继续";
    startBtn.textContent = "继续";
    overlay.classList.remove("hidden");
  } else {
    overlay.classList.add("hidden");
    restartTimer();
  }
}

const keyMap = {
  ArrowUp: "up", KeyW: "up",
  ArrowDown: "down", KeyS: "down",
  ArrowLeft: "left", KeyA: "left",
  ArrowRight: "right", KeyD: "right",
};
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") { e.preventDefault(); togglePause(); return; }
  const name = keyMap[e.code];
  if (name) { e.preventDefault(); setDirection(state, name); }
});

document.querySelectorAll(".d").forEach((btn) => {
  btn.addEventListener("click", () => setDirection(state, btn.dataset.dir));
});

startBtn.addEventListener("click", () => {
  if (paused) togglePause();
  else start();
});

reset();
