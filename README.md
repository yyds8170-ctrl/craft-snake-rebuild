# 贪吃蛇 · Snake（交互复刻）

[![CI](https://github.com/yyds8170-ctrl/craft-snake-rebuild/actions/workflows/ci.yml/badge.svg)](https://github.com/yyds8170-ctrl/craft-snake-rebuild/actions/workflows/ci.yml)
[![license](https://img.shields.io/badge/license-PolyForm%20Noncommercial%201.0.0-blue.svg)](LICENSE)
[![type](https://img.shields.io/badge/type-interactive%20demo-green.svg)](#特性)
[![test](https://img.shields.io/badge/unit%2018--e2e%209%20passing-brightgreen.svg)](#测试)

一个从零独立实现、可直接在浏览器运行的贪吃蛇，用于验证 **Craft Anything 取证 + 编码代理手工实现**闭环对带交互逻辑目标的处理能力。

> **维护者 / Maintainer：洋洋（[yyds8170-ctrl](https://github.com/yyds8170-ctrl)）**
>
> 本仓库为独立实现，不包含任何第三方源码或二进制，与相关第三方**无隶属、无背书、无赞助关系**。详见 [NOTICE](NOTICE)。

## 目录

- [特性](#特性)
- [如何运行](#如何运行)
- [测试](#测试-1)
- [目录结构](#目录结构-1)
- [许可证](#许可证)

## 特性

- 三档难度（简单 / 普通 / 困难），不同速度曲线
- 方向键 / WASD 控制，禁止 180° 直接反向
- 空格暂停 / 继续，开始与结束遮罩
- 吃食物计分，速度随分数递增
- **完美通关判定**：填满整个网格时显示通关界面
- 程序化音效（Web Audio，零外部资源），可静音
- 最高分通过 `localStorage` 持久化
- 撞墙 / 撞自身判定，结束后可重开
- 移动端虚拟方向键，响应式布局

## 如何运行

本项目使用 ES module，**请通过本地 HTTP 服务运行**（直接用 file:// 打开会因浏览器 CORS 策略阻止模块加载）：

```bash
python3 -m http.server 8000
# 浏览器访问 http://localhost:8000
```

## 测试

- **单元测试（18 项）**：对纯逻辑引擎 `js/engine.js` 验证移动、吃食物、碰撞、方向、速度、难度、完美通关，对 `js/sound.js` 用 mock AudioContext 验证音效。

```bash
node --test tests/engine.test.js tests/sound.test.js
```

- **端到端测试（9 项）**：通过 CDP 驱动真实页面，覆盖开始、暂停、恢复、撞墙结束、反向约束、难度切换、静音开关。

```bash
node e2e_test.mjs   # 需先启动带远程调试的浏览器（见 CI 配置）
```

## 目录结构

```text
rebuild-snake/
├── index.html
├── css/style.css
├── js/engine.js        # 纯逻辑引擎（可单元测试）
├── js/sound.js         # 程序化音效（Web Audio）
├── js/snake.js         # UI / 渲染 / 交互
├── tests/              # 单元测试 + 结构校验
├── e2e_test.mjs        # CDP 端到端测试
├── .github/workflows/ci.yml
├── CHANGELOG.md / CITATION.cff / VERSION
├── LICENSE             # PolyForm Noncommercial 1.0.0
├── NOTICE
└── evidence/           # 初始/进行中截图
```

## 许可证

本项目基于 [PolyForm Noncommercial License 1.0.0](LICENSE) 发布，仅限非商业用途。Copyright (c) 2026 洋洋。
