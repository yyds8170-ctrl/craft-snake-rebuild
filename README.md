# 贪吃蛇 · Snake（交互复刻）

[![license](https://img.shields.io/badge/license-PolyForm%20Noncommercial%201.0.0-blue.svg)](LICENSE)
[![type](https://img.shields.io/badge/type-interactive%20demo-green.svg)](#特性)
[![test](https://img.shields.io/badge/e2e-6%2F6%20passing-brightgreen.svg)](#测试)

一个从零独立实现、可直接在浏览器运行的贪吃蛇，用于验证 **Craft Anything 取证 + 豆包手工编码**闭环对带交互逻辑目标的处理能力。

> **维护者 / Maintainer：洋洋（[yyds8170-ctrl](https://github.com/yyds8170-ctrl)）**
>
> 本仓库为独立实现，不包含任何第三方源码或二进制，与相关第三方**无隶属、无背书、无赞助关系**。详见 [NOTICE](NOTICE)。

## 特性

- 方向键 / WASD 控制，禁止 180° 直接反向
- 空格暂停 / 继续，开始与结束遮罩
- 吃食物计分、随分数提升速度
- 最高分通过 `localStorage` 持久化
- 撞墙 / 撞自身判定，游戏结束可重开
- 移动端虚拟方向键，响应式布局

## 测试

通过 Chrome DevTools Protocol（CDP）驱动真实页面做端到端验证，覆盖开始、暂停、恢复、撞墙结束、反向约束等流程：

```bash
# 先启动带远程调试的浏览器，再运行
node e2e_test.mjs
# 结果：6/6 通过
```

## 如何运行

直接用浏览器打开 `index.html`，或：

```bash
python3 -m http.server 8000
# 访问 http://localhost:8000
```

## 目录结构

```text
rebuild-snake/
├── index.html
├── css/style.css
├── js/snake.js
├── e2e_test.mjs     # CDP 端到端测试
├── LICENSE          # PolyForm Noncommercial 1.0.0
├── NOTICE
└── evidence/        # 初始/进行中截图
```

## 许可证

本项目基于 [PolyForm Noncommercial License 1.0.0](LICENSE) 发布，仅限非商业用途。Copyright (c) 2026 洋洋。
