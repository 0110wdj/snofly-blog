---
title: "React 设计原理导论"
published: 2025-05-12
description: ""
image: ""
tags: ["react"]
category: "前端入门"
draft: true
---

# 0 前言

本文适合具有 react 编码经验的读者，或者熟悉原生 js 的读者。

本文基于 react 18 版本，介绍 react 的设计思路。

本文是一个初步引导，更多更详细的内容，可以参阅书籍《React 设计原理（卡颂）》，也可以进一步阅读源码。

## 本文目标

- 1、了解 react 整体设计思路
- 2、了解主要模块的设计思路
- 3、编写高质量代码

最终读者能够获得对 react 整体流程的认知，以及后续自学的基础能力和研究方向。

# 1 正文

## 1.1 react 整体设计思路

### 1.1.1 简单的 jsx 代码 🌰

先看一段经典的计数器代码：

```js
import React, { useState } from "react";
const App = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
    </div>
  );
};
```

显然，这会在页面上显示一个按钮，点击按钮后，数字会加 1。

我们在编写 jsx 代码时，能够很自然地想到：最终在 html 文档中的某个地方，会挂载这个 div 元素以及相关交互功能。

### 1.1.2 不简单的原生代码 🌰

思考上面的计数器代码，如果用原生 js 代码实现，我们会怎么去实现？

随即我们能够想到，类似这样的代码：

```js
const renderButton = () => {
  let count = 0;
  const button = document.createElement("button");
  button.textContent = `Count: ${count}`;
  button.addEventListener("click", () => {
    count++;
    button.textContent = `Count: ${count}`;
  });
};

const buttonElement = renderButton();
// appendChild(buttonElement)
```

基本思路是这样的，在点击按钮后，修改按钮的 textContent，从而实现数字的变化。

但是这里存在一些问题：

- 1、业务逻辑和 dom 操作耦合在一起，无法复用。
- 2、随着组件的规模的增加，代码会变得非常复杂，难以维护。
- 3、组件间的状态管理和交互逻辑不易共享和复用。

react 将业务逻辑和 dom 操作分离，实现代码的复用。

## 1.1.3 react 流程
