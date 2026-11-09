// 仓库结构与关键内容校验（无外部依赖，node 直接运行）
import assert from "node:assert";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");
const checks = [];
const check = (name, fn) => {
  try { fn(); checks.push(["PASS", name]); }
  catch (e) { checks.push(["FAIL", name + " — " + e.message]); }
};

for (const f of ["index.html", "css/style.css", "js/engine.js", "js/snake.js",
                  "LICENSE", "NOTICE", "README.md", "VERSION", "tests/engine.test.js"]) {
  check(`存在 ${f}`, () => assert.ok(existsSync(join(root, f))));
}

const html = read("index.html");
check("以 <!DOCTYPE html> 开头", () => assert.ok(html.trimStart().toLowerCase().startsWith("<!doctype html>")));
check("html 带 lang", () => assert.ok(/<html[^>]*\slang=/.test(html)));
check("含 canvas", () => assert.ok(/<canvas[\s>]/.test(html)));
check("脚本以 module 加载", () => assert.ok(/<script[^>]*type="module"[^>]*src="js\/snake\.js"/.test(html)));
check("含开始按钮", () => assert.ok(/id="start-btn"/.test(html)));

const engine = read("js/engine.js");
check("engine 导出 step", () => assert.ok(/export function step/.test(engine)));
check("engine 导出 createInitialState", () => assert.ok(/export function createInitialState/.test(engine)));

const license = read("LICENSE");
check("LICENSE 为 PolyForm Noncommercial 1.0.0", () => assert.ok(license.includes("PolyForm Noncommercial License 1.0.0")));
check("LICENSE 含洋洋署名", () => assert.ok(license.includes("洋洋")));

const notice = read("NOTICE");
check("NOTICE 含版权署名", () => assert.ok(notice.includes("Copyright (c) 2026 洋洋")));

let failed = 0;
for (const [s, n] of checks) {
  console.log(s, n);
  if (s === "FAIL") failed++;
}
console.log(`\n${checks.length - failed}/${checks.length} 通过`);
process.exit(failed ? 1 : 0);
