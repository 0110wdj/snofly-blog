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

这里我们需要注意到的代码功能：

- 组件模块的导入导出
- jsx 语法到 js 语法到转换
- 状态变量的定义与更新
- element 的生成、事件加载、dom 挂载、重新渲染

不必深究，有个印象即可，后文会进一步解释。

### 1.1.2 原生 js 代码 🌰

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

显然，这样的代码在实际的工程项目中，是不可取的。

### 1.1.3 react 的工作

我们做这样的实验（可以不用实际编码）：

- 1、基于 create-react-app 构建一个简单的 react 项目。

- 2、使用 1.1.1 中的计数器代码，引入到页面中。

- 3、编译运行。

- 4、点击按钮，页面中数字变化。

在这个过程中，react 帮我们做了什么？

这里需要分两种情况来讨论：

- 运行之前 —— 编码、打包阶段
- 运行时阶段

#### 1.1.3.1 运行之前

在运行之前，我们按照 react 的编码规范，完成 jsx 代码的编写（可以是 cra 工具生成的代码框架，也可以是手动修改的代码）。

这时，**react 本身负责设计 JSX 规范**。

接下来，在打包流程中，使用 Babel 工具将 JSX 代码转换为 JavaScript 代码，使得其能够在浏览器中运行。

例如：

```js
// 原始 JSX
<button onClick={() => setCount(count + 1)}>Click me</button>;

// Babel 编译后（简化）
React.createElement(
  "button",
  { onClick: () => setCount(count + 1) },
  "Click me"
);
```

这个转换过程中，由 **react 负责定义规则**，并**提供相关 API**，例如 React.createElement 。

#### 1.1.3.2 运行时阶段

简单来说，编译后的 js 代码可以直接运行在浏览器的 js 引擎中。

这些 js 代码，有一部分就是 react 的核心模块，他们会被加载到内存里面，在运行时发挥重要作用。

这些核心模块的本质，就是一组 js 函数和对象。

他们在两个时期发挥重要作用：1、代码初始化时；2、状态更新时。

**在初始化时，负责建立组件层级体系，创建页面；在状态更新时，负责响应交互，更新 UI**。

我们常说的 react 设计原理，就是指这两个时期的机制设计。

其中包括了我们常见的一些概念设计：

- fiber 架构
- hooks 系统
- 虚拟 dom
- diff 算法
- 合成事件
- 批量更新
- 上下文系统

这些概念设计，在后续章节中会简要介绍。

### 1.1.4 简单总结

react 的设计原理，就是指它在运行时是怎么发挥作用的。

我们了解了这些作用后，就能完全理解 1.1.1 中的计数器代码是怎么工作的了。

## 1.2 react 主要模块

js 中，一个函数被加载到内存中的调用栈中，然后执行。它一般会做两件事：1、进行一些运算；2、申请一些内存空间。

在 react 的初始化阶段，也相当于执行了一个函数，函数中同样会做两件事：1、进行一些运算；2、申请一些内存空间。

这些内存空间中，加载了它的各种模块，也就是一些函数和变量，便于后续调用。

在 react 的状态更新阶段，就是根据情况调用了某些模块的函数。

### 1.2.1 模板执行过程

在 React 中，组件代码会在两个阶段执行：

- 初始化阶段（首次渲染）

- 更新阶段（状态或 props 变化时）

本文重点介绍更新阶段的执行过程，因为它更容易理解，也足以说明 react 的内部机制。

以用户点击按钮为例，react 的执行过程大致如下：

- 用户点击按钮之后，触发事件 (js 原生功能：事件冒泡机制)
- 触发 onClick 回调函数 (react 功能：自定义的事件加载机制)
- 函数执行 (js 原生功能：调用栈逻辑)
- 函数执行到 setCount() 函数，触发调度任务 (react 功能：调度中心处理)

到这里其实点击事件就结束了，后续是 react 的调度中心的工作了。

调度中心根据优先级给出下一帧要执行的任务，给到渲染中心。

渲染中心，计算虚拟 dom 的变化，确定 UI 更新内容。

最后由具体的 DOM 操作莫款，完成 UI 更新。

整个过程中，不同模块之间的通信依赖于 React 的架构设计，其核心思路本质上是**发布-订阅模式（Pub-Sub）**的应用。

接下来我们以这个过程为例，逐步讲解涉及到的模块，及其相关功能。

### 1.2.2 初始化过程简介

在浏览器下载 js 代码之后，且在用户操作点击之前，这段时间，浏览器会进行一系列的初始化操作。

有一部分特殊的 js 代码执行之后，浏览器会产生两个重要的变化：

1、通过 ReactDom.render() 方法，将组件渲染到页面上。
2、在内存中加载了很多函数、对象、变量，等待之后使用。

例如，将一个 App dom 挂载到指定的 root 元素上：

```js
import React from "react";
import ReactDOM from "react-dom";
const App = () => {
  return <div id="root"></div>;
};
ReactDOM.render(<App />, document.getElementById("root"));
```

这里的 App dom 挂载之后，实际上一共会存在三个 App Dom 对象。

其中一个是真实 dom, 也就是页面中的 root 元素。

另外两个是虚拟 dom, 其实就是相似于真实 dom 的两个 js 对象，这两个对象存在于内存中。

在真实的 App dom 生成的时候，会有很多事项要处理：

- 基于 react 的事件加载机制，为其绑定事件。
- 如果有状态变量的话，会基于 react 的 hooks 机制，为其生成状态变量。
- 如果有副作用函数，需要订阅相关的状态变量。

至此，基本的 js 代码执行完成，页面进入一个待更新的状态。

#### 1.2.2.1 状态注册

这里选择性的介绍一下，初始化的过程中，这句代码做了什么：

```js
const [count, setCount] = useState(0);
```

- 创建一块“状态内存空间”，里面存储了状态变量 count 的初始值 0
- 第一次渲染，在该组件实例的 Hook 链表中，注册一个新的状态节点
- 生成一个与这个状态绑定的更新函数 setCount()

> React 为了实现函数组件中的状态管理，使用了一种“基于调用顺序”的 Hook 链表结构，用来记录每一个 Hook 的状态。

其中，由于 Hook 链表的顺序是需要固定的，所以在函数组件中，不能使用这样的代码：

```js
const [count, setCount] = useState(0);
if (condition) {
  const [count, setCount] = useState(0);
}
```

这样的代码会导致 Hook 链表的顺序不一致，从而导致状态管理的错误。

### 1.2.3 触发更新

用户点击按钮，触发事件。我们来看这个过程：

```js
function onClick() {
  setCount(count + 1);
}
```

其中只有一句代码，调用了 setCount() 函数，这个函数是 react 的 hooks 机制提供的。

源代码中的类型定义：

```ts
function useState<S>(
  initialState: S | (() => S)
): [S, Dispatch<SetStateAction<S>>];
```

从名称也可以看出，setCount 做的事情是发送(Dispatch)更新操作，而不是直接 change state。

执行这个函数之后，本质上是做了这三件事情：

- 创建一个更新任务对象（Update）
- 把任务放入组件的更新队列（Update Queue）
- 交给调度器（Scheduler）安排“重新渲染一次组件”

所以到这一步执行之后，内存中会多出一个 Update 对象，会由调度器去进一步处理。

Update 对象的结构大概是这样的：

```js
{
  action: newState,      // 或者是一个函数
  next: null,            // 链表结构中的下一个 update
  lane: 优先级标记,
}
```

这里面的 action 就是用于计算新的 state 的函数，如果存在多个更新，那么可能会进行合并。

总之，如果有这样的操作：

```js
setCount(1);
setCount((prev) => prev + 2);
```

那么产生这样的更新队列：

```js
Update1: {
  action: 1,
  next: Update2,
  lane: ...
}

Update2: {
  action: prev => prev + 2,
  next: null,
  lane: ...
}
```

最后，把更新任务交给调度器，等待执行进一步处理。

### 1.2.4 调度器

调度器的核心目标是：按照优先级合理安排组件重新渲染的时间和方式。

如果把调度器理解为一个复杂函数，它的输入是：

- Fiber
- Lane
- UpdateQueue
- 当前调度状态
- 当前时间戳

它没有直接的输出，而是产生一些副作用：

- 安排一次调和任务（reconciliation）
- 将更新任务放入任务队列
- 触发浏览器调度
- 可能打断已有任务
- 最终执行“渲染”或“提交”任务

这里不理解没关系，我们可以先跳过。

回到上面的例子，调度中心收到了更新队列，其中包含了两个 Update 对象：

```
UpdateQueue: Update1 -> Update2
```

然后调度中心开始工作了。

#### 1.2.4.1 将组件标记为待更新状态

我们之前提到了，我们在内存中有两个对应于真实 dom 的虚拟 dom。

这两个虚拟 dom 本质就是树结构的对象，我们也可以称其为两个 Fiber Node 。

我们常说的 Fiber 架构，就是基于这种树结构的设计。

首先，看第一个问题：为什么使用两个对象？

答案是：参考双缓存机制，获得极大的性能优化。

进一步，我们可以区分这两个对象：称一个为 current node，另一个为 workInProgress node。

current node 对应于当前的真实 dom ，它作用有两个：
1、基于他生成 workInProgress node；
2、和真实 dom 比较。

workInProgress node 是一个对象，react 将下一帧需要更新的内容，首先应用到这个对象上。

需要实际应用更新的时候，切换一下这两个 node 即可。

回到举例中，我们的调度器收到了更新队列，其中包含了两个 Update 对象。

这个更新队列会被插入到 updateQueue.shared.pending 中，这是 current node 中的一个属性，等待进一步处理。

基于 Update 对象，调度器能够知道并标记需要更新的组件，然后会向上级组件递归传递，直到 root 节点。

#### 1.2.4.2 计算优先级（Lane 模型）

我们知道，浏览器进程中的 js 线程和 UI 线程是互斥的。

为了防止 js 线程阻塞 UI 线程，在任务量很大时，只能分批执行，于是用到了 react 的优先级系统。

这里介绍一下 Lane 模型：它的本质是许多二进制数字的处理机制。

包括两部分：1、优先级定义——数字的定义；2、合并批量处理——优先级逻辑操作。

比如，不同的操作，优先级是不同的：

```js
const SyncLane = 0b0000000000000000000000000000001; // 同步优先级
const InputContinuousLane = 0b0000000000000000000000000000010; // 连续输入
const DefaultLane = 0b0000000000000000000000000000100; // 默认优先级
```

```js
{
  action: (count) => count + 1,
  lane: SyncLane, // 代表是“同步更新”，比如点击事件触发的
}
```

这样就是简单的标记了这个操作的优先级。

回到举例中，调度器标记了更新状态后，还会进一步计算和标记优先级状态。

#### 1.2.4.3 合并更新

如果存在这样的代码：

```js
setCount(1);
setCount(2);
setCount(3);
```

显然，在调度器中，会合并为一次更新操作，也就只会触发一次下一阶段的处理流程。

更复杂的情况，setCount(p=>p+1)，则会有更多处理的逻辑，本文略过。

#### 小结

至此，调度器的大概工作就介绍完成了。

简单来说，调度器更新了 Fiber node，准备好了全部信息之后，等待下一阶段的执行。

下一阶段，在 react 中称为 render 阶段，中文翻译为渲染阶段，这里的渲染和浏览器中的 cssom 和 dom 渲染是两个概念。

注意：调度器在当前调度工作完成后，可能还有部分任务没有处理。这些任务，将会等待下一次调度的处理。

### 1.2.5 render 阶段

render 阶段更具 current node 计算 workInProgress node。

<!-- #### 第四步：应用更新

注意：调度器代码执行期间，浏览器页面并不会发生变化，此时的操作都是内存中对象的修改。

调度器得到了要更新的内容之后，就可以应用到 current node 上。

它会修改 current node 上某个子节点的属性。

比如这样的的代码：

```
// ... count 初始值是 1
<div id="count">count<div>
// ...
setCount(3);
// ...
```

在 workInProgress node 上，会存在一个 div 节点，这个节点的属性会被修改。

这里之所以能够找到这个节点，是因为 Update 中存在了相关标记。

这一部分完成后，workInProgress node 就已经完成了修改。

此时，真实 dom 的 div 节点还是 1，另一个虚拟 dom current node 中的 div 节点也是 1。

#### 第五步：切换 Fiber node

在这一步，调度器会切换 Fiber node 。

这一步骤最关键的就是，将 workInProgress node 赋值给 current node 。

然后 current node 就会和真实 dom 产生差异，然后就会触发 react 下一阶段的执行。 -->
