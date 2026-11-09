import { test } from "node:test";
import assert from "node:assert";
import { createSoundEngine, SOUNDS } from "../js/sound.js";

// 最小可用的 Web Audio mock
function mockCtx() {
  const nodes = [];
  const makeNode = () => ({
    connect: () => makeNode(),
    start: () => {}, stop: () => {},
    frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
    gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
  });
  return {
    state: "running",
    currentTime: 0,
    destination: {},
    resume: async () => {},
    createOscillator: () => { const n = makeNode(); nodes.push(n); return n; },
    createGain: () => makeNode(),
    _nodes: nodes,
  };
}

test("非静音播放已知音效返回 true 并创建振荡器", () => {
  const ctx = mockCtx();
  const engine = createSoundEngine(ctx);
  assert.equal(engine.play("eat"), true);
  assert.equal(ctx._nodes.length, 1);
});

test("静音时播放返回 false", () => {
  const ctx = mockCtx();
  const engine = createSoundEngine(ctx);
  engine.setMuted(true);
  assert.equal(engine.isMuted(), true);
  assert.equal(engine.play("eat"), false);
  assert.equal(ctx._nodes.length, 0);
});

test("未知音效返回 false", () => {
  const engine = createSoundEngine(mockCtx());
  assert.equal(engine.play("nope"), false);
});

test("无 AudioContext 时安全返回 false", () => {
  const engine = createSoundEngine(null);
  assert.equal(engine.play("eat"), false);
});

test("suspended 状态会触发 resume", async () => {
  const ctx = mockCtx();
  let resumed = false;
  ctx.state = "suspended";
  ctx.resume = async () => { resumed = true; };
  const engine = createSoundEngine(ctx);
  engine.play("over");
  assert.equal(resumed, true);
  assert.ok(SOUNDS.over);
});
