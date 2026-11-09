import { test } from "node:test";
import assert from "node:assert";
import {
  DIRS, createInitialState, placeFood, setDirection, step,
  hitsWall, hitsSelf, currentSpeed, DIFFICULTIES,
} from "../js/engine.js";

test("初始状态：3节蛇、向右、分数0、有食物、status ready", () => {
  const s = createInitialState(20);
  assert.equal(s.snake.length, 3);
  assert.deepEqual(s.dir, DIRS.right);
  assert.equal(s.score, 0);
  assert.equal(s.status, "ready");
  assert.ok(s.food && s.food.x >= 0 && s.food.x < 20);
});

test("placeFood 不会落在蛇身上", () => {
  const s = createInitialState(20);
  for (let i = 0; i < 20; i++) {
    const f = placeFood(s.snake, 20);
    assert.ok(!s.snake.some((seg) => seg.x === f.x && seg.y === f.y));
  }
});

test("setDirection 允许合法转向，禁止180度反向", () => {
  const s = createInitialState(20);
  assert.equal(setDirection(s, "up"), true);
  assert.deepEqual(s.nextDir, DIRS.up);
  // 当前向右，向左应被拒绝
  assert.equal(setDirection(s, "left"), false);
  assert.deepEqual(s.nextDir, DIRS.up);
  // 非法方向名
  assert.equal(setDirection(s, "nope"), false);
});

test("step 普通移动：头部前进、长度不变", () => {
  const s = createInitialState(20);
  // 把食物放远，避免这一步吃到
  s.food = { x: 0, y: 0 };
  const beforeHead = { ...s.snake[0] };
  const ev = step(s);
  assert.equal(ev, "moved");
  assert.equal(s.snake[0].x, beforeHead.x + 1);
  assert.equal(s.snake.length, 3);
});

test("step 吃到食物：分数+1、长度+1", () => {
  const s = createInitialState(20);
  // 蛇头在 (10,10)、向右，把食物放在 (11,10)
  s.food = { x: 11, y: 10 };
  const lenBefore = s.snake.length;
  const ev = step(s, () => 0); // 注入 rng，新食物确定
  assert.equal(ev, "ate");
  assert.equal(s.score, 1);
  assert.equal(s.snake.length, lenBefore + 1);
});

test("撞墙判定", () => {
  assert.equal(hitsWall({ x: -1, y: 0 }, 20), true);
  assert.equal(hitsWall({ x: 20, y: 0 }, 20), true);
  assert.equal(hitsWall({ x: 19, y: 19 }, 20), false);
});

test("step 撞墙后 status=over", () => {
  const s = createInitialState(20);
  // 让蛇头位于右边界并继续向右
  s.snake = [{ x: 19, y: 10 }, { x: 18, y: 10 }, { x: 17, y: 10 }];
  s.dir = DIRS.right; s.nextDir = DIRS.right;
  s.food = { x: 0, y: 0 };
  assert.equal(step(s), "over");
  assert.equal(s.status, "over");
});

test("撞自身判定", () => {
  const snake = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 9, y: 11 }, { x: 9, y: 10 }];
  // 头部向上走到 (10,9) 不撞；构造一个会撞到身体的 head
  assert.equal(hitsSelf(snake, { x: 10, y: 11 }), true);
  assert.equal(hitsSelf(snake, { x: 10, y: 9 }), false);
});

test("currentSpeed 随分数提升，且不低于下限", () => {
  assert.equal(currentSpeed(0), 140);
  assert.equal(currentSpeed(5), 128);
  assert.equal(currentSpeed(100), 60); // 触底
});

test("难度配置：createInitialState 携带对应速度参数", () => {
  const easy = createInitialState(20, "easy");
  const hard = createInitialState(20, "hard");
  assert.equal(easy.speedConfig, DIFFICULTIES.easy);
  assert.equal(hard.difficulty, "hard");
  assert.ok(DIFFICULTIES.hard.base < DIFFICULTIES.easy.base);
});

test("不同难度初始速度不同", () => {
  const easy = createInitialState(20, "easy");
  const hard = createInitialState(20, "hard");
  assert.ok(currentSpeed(0, easy.speedConfig) > currentSpeed(0, hard.speedConfig));
});

test("非法难度回退到 normal", () => {
  const s = createInitialState(20, "nope");
  assert.equal(s.difficulty, "normal");
  assert.equal(s.speedConfig, DIFFICULTIES.normal);
});
