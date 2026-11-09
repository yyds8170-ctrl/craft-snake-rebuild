(() => {
  "use strict";

  const canvas = document.getElementById("board");
  const ctx = canvas.getContext("2d");
  const GRID = 20;                 // 每格像素
  const CELLS = canvas.width / GRID; // 20 x 20
  const BASE_SPEED = 140;           // 初始步长(ms)
  const MIN_SPEED = 60;

  const scoreEl = document.getElementById("score");
  const bestEl = document.getElementById("best");
  const overlay = document.getElementById("overlay");
  const overlayTitle = document.getElementById("overlay-title");
  const overlayText = document.getElementById("overlay-text");
  const startBtn = document.getElementById("start-btn");

  let snake, dir, nextDir, food, score, timer, running, paused;
  let best = Number(localStorage.getItem("snake_best") || 0);
  bestEl.textContent = best;

  const DIRS = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  };

  function reset() {
    snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    dir = DIRS.right;
    nextDir = DIRS.right;
    score = 0;
    scoreEl.textContent = 0;
    placeFood();
    draw();
  }

  function placeFood() {
    const free = [];
    for (let y = 0; y < CELLS; y++) {
      for (let x = 0; x < CELLS; x++) {
        if (!snake.some((s) => s.x === x && s.y === y)) free.push({ x, y });
      }
    }
    food = free[Math.floor(Math.random() * free.length)];
  }

  function currentSpeed() {
    // 每吃 5 个加快 12ms，直到下限
    return Math.max(MIN_SPEED, BASE_SPEED - Math.floor(score / 5) * 12);
  }

  function tick() {
    dir = nextDir;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    // 撞墙
    if (head.x < 0 || head.y < 0 || head.x >= CELLS || head.y >= CELLS) {
      return gameOver();
    }
    // 撞自己（尾巴会移动，最后一格不算）
    if (snake.slice(0, -1).some((s) => s.x === head.x && s.y === head.y)) {
      return gameOver();
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score += 1;
      scoreEl.textContent = score;
      if (score > best) {
        best = score;
        bestEl.textContent = best;
        localStorage.setItem("snake_best", String(best));
      }
      placeFood();
      restartTimer(); // 速度可能变化
    } else {
      snake.pop();
    }
    draw();
  }

  function draw() {
    ctx.fillStyle = getCss("--panel");
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 网格线
    ctx.strokeStyle = getCss("--grid");
    ctx.lineWidth = 1;
    for (let i = 1; i < CELLS; i++) {
      ctx.beginPath(); ctx.moveTo(i * GRID, 0); ctx.lineTo(i * GRID, canvas.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * GRID); ctx.lineTo(canvas.width, i * GRID); ctx.stroke();
    }

    // 食物
    ctx.fillStyle = getCss("--food");
    roundCell(food.x, food.y, 5);

    // 蛇
    snake.forEach((seg, i) => {
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
    timer = setInterval(tick, currentSpeed());
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
    overlayText.textContent = `本局得分 ${score}，再来一局？`;
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

  function setDirection(name) {
    const d = DIRS[name];
    if (!d) return;
    // 禁止直接反向（基于当前实际方向）
    if (d.x === -dir.x && d.y === -dir.y) return;
    nextDir = d;
  }

  // 键盘
  const keyMap = {
    ArrowUp: "up", KeyW: "up",
    ArrowDown: "down", KeyS: "down",
    ArrowLeft: "left", KeyA: "left",
    ArrowRight: "right", KeyD: "right",
  };
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") { e.preventDefault(); togglePause(); return; }
    const name = keyMap[e.code];
    if (name) { e.preventDefault(); setDirection(name); }
  });

  // 触屏按钮
  document.querySelectorAll(".d").forEach((btn) => {
    btn.addEventListener("click", () => setDirection(btn.dataset.dir));
  });

  startBtn.addEventListener("click", () => {
    if (paused) togglePause();
    else start();
  });

  reset();
})();
