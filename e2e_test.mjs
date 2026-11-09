// 通过 CDP 端到端验证贪吃蛇真实行为（node 22 内置 WebSocket/fetch）
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const debugPort = process.env.CA_DEBUG_PORT || "9336";
const pages = await (await fetch(`http://127.0.0.1:${debugPort}/json`)).json();
const page = pages.find((p) => p.type === "page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));

let id = 0;
function send(method, params = {}) {
  return new Promise((resolve) => {
    const mid = ++id;
    const onMsg = (e) => {
      const m = JSON.parse(e.data);
      if (m.id === mid) { ws.removeEventListener("message", onMsg); resolve(m); }
    };
    ws.addEventListener("message", onMsg);
    ws.send(JSON.stringify({ id: mid, method, params }));
  });
}
async function ev(expr) {
  const r = await send("Runtime.evaluate", { expression: expr, returnByValue: true });
  if (r.result?.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails));
  return r.result.result.value;
}
const press = (code) =>
  ev(`document.dispatchEvent(new KeyboardEvent("keydown",{code:"${code}",bubbles:true})), true`);
const state = () =>
  ev(`JSON.stringify({
    overlayHidden: document.getElementById("overlay").classList.contains("hidden"),
    title: document.getElementById("overlay-title").textContent,
    score: document.getElementById("score").textContent,
    best: document.getElementById("best").textContent
  })`);

const results = [];
// 1. 初始状态
results.push(["初始遮罩显示", (await ev(`document.getElementById("overlay").classList.contains("hidden")`)) === false]);

// 2. 点击开始
await ev(`document.getElementById("start-btn").click()`);
await sleep(400);
let s = JSON.parse(await state());
results.push(["开始后遮罩隐藏", s.overlayHidden === true]);

// 3. 暂停
await press("Space");
await sleep(200);
s = JSON.parse(await state());
results.push(["空格暂停-显示暂停", s.overlayHidden === false && s.title === "已暂停"]);

// 4. 恢复
await press("Space");
await sleep(200);
s = JSON.parse(await state());
results.push(["再按空格恢复", s.overlayHidden === true]);

// 5. 不转向，蛇向右撞墙（初始头x=10，约9步*140ms）
await sleep(2200);
s = JSON.parse(await state());
results.push(["撞墙后游戏结束", s.overlayHidden === false && s.title === "游戏结束"]);

// 6. 禁止反向约束（结束态再开始，验证转向逻辑不报错）
await ev(`document.getElementById("start-btn").click()`);
await sleep(300);
await press("ArrowLeft"); // 当前向右，按左应被忽略而非异常
await sleep(300);
s = JSON.parse(await state());
results.push(["禁止180度反向且无异常", s.overlayHidden === true]);

ws.close();
let pass = 0;
console.log("=== 贪吃蛇端到端测试 ===");
for (const [name, ok] of results) {
  console.log((ok ? "PASS" : "FAIL") + "  " + name);
  if (ok) pass++;
}
console.log(`\n${pass}/${results.length} 通过`);
process.exit(pass === results.length ? 0 : 1);
