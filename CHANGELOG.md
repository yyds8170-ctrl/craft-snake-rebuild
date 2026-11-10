# 变更日志

本项目遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 规范，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)，许可证为 PolyForm Noncommercial 1.0.0。

## [1.3.0] - 2026-11-10

### 新增
- 完美通关判定：蛇填满整个网格（无空格可放食物）时返回 `won`，UI 显示通关界面。
- 通关单元测试（2x2 棋盘），单元测试增至 18 项。

### 变更
- 文档措辞中性化：统一使用「编码代理」，移除所有厂商/模型相关字样。

## [1.2.0] - 2026-11-09

### 新增
- 难度选择（简单 / 普通 / 困难）：不同初始速度、下限与加速曲线，引擎层归一化非法难度。
- 程序化音效（`js/sound.js`，Web Audio 合成）：吃食物与游戏结束音效，零外部资源，可一键静音。
- 音效单元测试（`tests/sound.test.js`，5 项，mock AudioContext）与 4 项难度单元测试。
- 端到端测试扩展至 9 项（新增难度切换、静音开关）。
- 结构校验扩展至 25 项。

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
