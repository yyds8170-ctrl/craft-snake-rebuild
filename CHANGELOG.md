# 变更日志

本项目遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 规范，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)，许可证为 PolyForm Noncommercial 1.0.0。

## [1.1.0] - 2026-11-09

### 变更
- 重构：将纯游戏逻辑抽离为 `js/engine.js`（ES module），`js/snake.js` 仅负责 UI/渲染/定时器。

### 新增
- 引擎单元测试（`tests/engine.test.js`，9 项，node:test）：移动、吃食物、撞墙、撞自身、方向约束、速度。
- 结构校验脚本（`tests/validate.mjs`，19 项）。
- GitHub Actions CI：结构校验、单元测试、基于本地 HTTP 服务的端到端测试。
- 工程文件：`VERSION`、`CITATION.cff`、`CHANGELOG.md`。
- 文档：说明 ES module 需通过 HTTP 服务运行（file:// 受 CORS 限制）。

## [1.0.0] - 2026-11-09

### 新增
- 可玩贪吃蛇首版：键盘/触屏控制、计分、速度递增、暂停、本地最高分。
- CDP 端到端测试 6/6 通过。
