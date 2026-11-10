// 贪吃蛇纯逻辑引擎（不依赖 DOM，可在 node 中单元测试）
export const DIRS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export const SPEED_CONFIG = { base: 140, min: 60, stepEvery: 5, stepMs: 12 };

// 难度配置：不同初始速度、下限与加速曲线
export const DIFFICULTIES = {
  easy: { label: "简单", base: 170, min: 90, stepEvery: 6, stepMs: 10 },
  normal: { label: "普通", base: 140, min: 60, stepEvery: 5, stepMs: 12 },
  hard: { label: "困难", base: 110, min: 45, stepEvery: 4, stepMs: 14 },
};

export function createInitialState(cells = 20, difficulty = "normal") {
  const validDifficulty = DIFFICULTIES[difficulty] ? difficulty : "normal";
  const cfg = DIFFICULTIES[validDifficulty];
  const state = {
    cells,
    difficulty: validDifficulty,
    speedConfig: cfg,
    snake: [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }],
    dir: DIRS.right,
    nextDir: DIRS.right,
    food: null,
    score: 0,
    status: "ready",
  };
  state.food = placeFood(state.snake, cells);
  return state;
}

// 在所有空闲格中随机放置食物；rng 可注入以便测试
export function placeFood(snake, cells, rng = Math.random) {
  const free = [];
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      if (!snake.some((s) => s.x === x && s.y === y)) free.push({ x, y });
    }
  }
  if (!free.length) return null;
  return free[Math.floor(rng() * free.length)];
}

// 方向约束：禁止相对当前实际方向 180° 反向
export function setDirection(state, name) {
  const d = DIRS[name];
  if (!d) return false;
  if (d.x === -state.dir.x && d.y === -state.dir.y) return false;
  state.nextDir = d;
  return true;
}

export function nextHead(state) {
  const d = state.nextDir;
  return { x: state.snake[0].x + d.x, y: state.snake[0].y + d.y };
}

export function hitsWall(head, cells) {
  return head.x < 0 || head.y < 0 || head.x >= cells || head.y >= cells;
}

export function hitsSelf(snake, head) {
  // 尾巴会移动，排除最后一格
  return snake.slice(0, -1).some((s) => s.x === head.x && s.y === head.y);
}

// 推进一帧。返回事件："over" | "ate" | "moved"
export function step(state, rng = Math.random) {
  if (state.status === "over") return "over";
  state.dir = state.nextDir;
  const head = nextHead(state);

  if (hitsWall(head, state.cells) || hitsSelf(state.snake, head)) {
    state.status = "over";
    return "over";
  }

  state.snake.unshift(head);

  if (state.food && head.x === state.food.x && head.y === state.food.y) {
    state.score += 1;
    state.food = placeFood(state.snake, state.cells, rng);
    if (state.food === null) { // 网格填满：完美通关
      state.status = "won";
      return "won";
    }
    state.status = "playing";
    return "ate";
  }

  state.snake.pop();
  state.status = "playing";
  return "moved";
}

export function currentSpeed(score, cfg = SPEED_CONFIG) {
  return Math.max(cfg.min, cfg.base - Math.floor(score / cfg.stepEvery) * cfg.stepMs);
}
