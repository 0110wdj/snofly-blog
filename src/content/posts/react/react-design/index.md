---
title: "React 设计原理导论"
published: 2025-05-23
description: ""
image: ""
tags: ["react"]
category: "前端入门"
draft: false
---

# 0 前言

本文适合具有 react 编码经验的读者，或者熟悉原生 js 的读者。

本文基于 react 18 版本，以“函数组件 + hooks”的形式，介绍 react 的设计思路。

本文是一个初步引导，更多详细的内容，可以参阅书籍《React 设计原理（卡颂）》，也可以进一步阅读源码。

## 本文目标

- 1、了解 react 整体设计思路
- 2、了解主要模块的设计思路
- 3、了解 react 源码结构

最终期望：读者能够深入对 react 设计的理解，并为后续学习打下基础。

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

这里我们可能会回到的一些工作：

- 组件模块的导入导出
- jsx 语法到 js 语法到转换
- 状态变量的定义与更新
- element 的生成、事件加载、dom 挂载、重新渲染

总之，这个组件是能用了。

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

- 运行之前 —— 编码打包阶段
- 运行时阶段

#### 1.1.3.1 运行之前

在运行之前，我们按照 react 的编码规范，完成 jsx 代码的编写（可以是 cra 工具生成的代码框架，也可以是手动修改的代码）。

这时，**react 提供了一种 JSX 规范**。

接下来，在打包流程中，使用 Babel 工具将 JSX 代码转换为 JavaScript 代码，然后就能在浏览器中运行。

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

转换后的 js 代码就可以直接运行在浏览器的 js 引擎中了。

这些 js 代码，除了业务相关代码，就是工具代码了，例如 react 、 lodash 等。

react 的核心模块代码执行之后，一些函数和对象会被加载到内存里面，在运行时发挥重要作用。

运行时分为两个时期来看待 react 的工作：

- 1、**代码初始化时** —— 负责建立组件层级体系
- 2、**状态更新时** —— 负责响应交互，更新 UI

我们常说的 react 设计原理，就是指这两个时期的代码逻辑。

其中包括了我们常见的一些概念：

- fiber
- hooks
- 虚拟 DOM
- diff 算法

这些概念设计，在后续章节中会介绍到。

#### 1.1.3.3 初始化时期

浏览器下载 js 代码，在执行 react 的工具代码之后，且在在状态更新之前，这段时间，react 会进行一系列的初始化操作。

这里有两个重要的变化：

1、通过 ReactDom.render() 方法，将组件渲染到页面上。

例如，将一个 App 挂载到指定的 root 元素上：

```js
import React from "react";
import ReactDOM from "react-dom";
const App = () => {
  return <div>Hello World</div>;
};
ReactDOM.render(<App />, document.getElementById("root"));
```

这里的 App 挂载之后，页面上就能看到 Hello World 了，开发者工具中 Element 里面也能看到这个 div 元素。

2、在内存中加载了很多函数、对象、标记，等待之后使用。

这里比较关键的就是 Fiber Node。

此时，实际上一共会存在三个 App DOM 对象：

- 其中一个是真实 DOM, 也就是页面中的 root 元素。

- 另外两个是虚拟 DOM (也称为 Fiber node), 其实本质是相似于真实 DOM 的两个 js 对象，它们只会存在于内存中参与计算。

在真实的 App DOM 生成的时候，会有很多事项要处理：

- 基于 react 的事件加载机制，为其绑定事件。
- 如果有状态变量的话，会基于 react 的 hooks 机制，为其生成状态变量。
- 如果有副作用函数，需要订阅相关的状态变量。

至此，基本的 js 代码执行完成，页面进入一个待更新的状态。

#### 1.1.3.4 更新时期

在状态更新时期， react 会不断推动工作流程的循环：

- 触发任务——>计算更新——>更新 DOM——>触发任务——>计算更新——>更新 DOM——>循环...

以用户点击计数器按钮为例，触发任务的过程大致如下：

- 用户点击按钮之后，触发事件
- 触发 onClick 回调函数
- 回调函数执行
- 函数内执行到 setCount() 函数
- 创建更新任务

到这里，点击事件的同步代码执行过程就结束了，后续是 react 的调度器的工作了。

后续工作流程是这样的：

- 调度阶段：调度器，根据优先级给出这一帧要执行的任务，给到渲染中心。
- 渲染阶段：渲染中心，根据当前的虚拟 DOM ，执行更新代码，得到下一帧要更新的虚拟 DOM 。
- 提交阶段：切换两个虚拟 DOM，使用 diff 算法确定 UI 更新的内容，然后执行 UI 更新。

再然后就是循环了，等待下一次用户操作，或者执行其他低优先级的更新任务。

### 1.1.4 小结

react 的设计原理，就是指它在运行时是怎么发挥作用的，主要包括初始化和更新两个时期。

我们了解了这些作用后，就能很好的理解我们写的计数器组件代码了。

下面重点介绍**运行时阶段**的**状态更新时期**，结合实例，了解 react 在工作流程中的每一步做了什么。

这是一个多模块协同的工作流程，数据在各个模块之间传递、共享。

## 1.2 初始化时期简介

js 中，一个工具函数被加载到调用栈中执行，它通常会做两件事：

- 1、进行一些运算；
- 2、申请一些内存空间。

在 react 的初始化时期，也相当于执行了一个函数，函数中同样会做这两件事。

在申请到的内存空间中，会加载各种模块 —— 一些函数和变量，然后等待更新。

在触发更新时期，这些模块和变量将发挥重要作用。

后文我们以计数器点击过程为例，逐步讲解涉及到的模块，及其相关功能。

我们会主要介绍这些模块的作用：

- 调度中心
- 渲染中心
- 提交中心

在这之前，先简要介绍一些初始化过程中建立的一些变量，因为更新时期会用到它们。

### 1.2.1 状态注册

初始化的过程中，这句代码做了什么：

```js
const [count, setCount] = useState(0);
```

- 1、调用 useState(0)
- 2、创建一个 Hook 节点

```js
const hook = {
  memoizedState: 0,     // 当前 state
  baseState: 0,         // 用于追踪上次的 state
  queue: {
    pending: null,      // 这里挂的是 Update 链表（setState 生成的 update 就在这里）
    dispatch: ...,      // 就是 setCount 本身
  },
  next: null            // 指向下一个 Hook（useState、useEffect 等）
}
```

- 3、把这个 Hook 节点加入当前函数组件对应的 fiber 的 Hook 链表中

如果 Hook 链表不存在，则会创建一个。

- 4、创建 setCount 函数（dispatch）

```js
function dispatchSetState(action) {
  // 创建 update 对象
  const update = { action, lane, next };

  // 将 update 加入 queue.pending（环形链表）
  // 调用 scheduleUpdateOnFiber(fiber, lane)
}
```

上面提到的 fiber 是一个树结构的对象，这里面包含了很多属性，其中就有一个 Hook 链表。

fiber 在形式上，就是 DOM 节点在内存中的表示，也称为 Fiber Node，它和真实的 DOM 节点一一对应。

### 1.2.2 引申的问题：为什么不能在 if 中使用 hook

在函数组件中，不能使用这样的代码：

```js
const [count, setCount] = useState(0);
if (condition) {
  const [num, setNum] = useState(0);
}
```

这样的代码会导致 Hook 链表的顺序不一致，从而导致状态管理的错误，所以 react 会直接报错。

更深层的原因是：

- useState 本身没有“名字”概念，React 不知道你用的是什么变量名；
- 函数组件每次执行时会重新声明这些变量，变量名只是 JS 层的临时绑定；
- 链表和顺序，可以准确找到对应的状态；

## 1.3 更新时期的工作流程

### 1.3.1 触发更新

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

这里面的 action 就是用于计算新的 state 的函数。

调度时，如果存在多个更新，那么可能会进行合并。

总之，如果有这样的操作：

```js
setCount(1);
setCount((prev) => prev + 2);
```

那么会产生这样的更新队列：

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

这个更新队列会被放在这个地方：

当前函数组件所对应的 fiber 节点的 memoizedState 属性，所指向的 hook 链表中的第一个 hook 节点的 queue 属性中的 pending 数组中。

举例说明：

如果有这样的代码：

```js
function App() {
  const [count, setCount] = useState(0); // Hook 1
  const [name, setName] = useState("React"); // Hook 2

  return (
    <button onClick={() => setName("Vue")}>
      {count} - {name}
    </button>
  );
}
```

在执行到两个 hook 声明时，fiber 中会产生这样的变化：

```js
fiber.memoizedState → Hook(count) → Hook(name)
```

初始化了 Hook 1 和 Hook 2，然后执行了 onClick 函数，产生了更新任务：

```js
fiber.memoizedState → Hook(count=0, queue=null)
                    → Hook(name="React", queue.pending=[update:"Vue"])
```

如果有新的 UpDate 对象产生，它会被插入到 queue.pending 中。

比如：

```js
fiber.memoizedState → Hook(count=0, queue=null)
                    → Hook(name="React",
                        queue.pending=[
                          update:"Vue"，
                          update:"js",
                          update:(pre)=>{pre+"something"}
                          ]
                        )
```

最后，把更新任务交给调度器，等待执行进一步处理。

### 1.3.2 调度器

调度器的核心目标是：按照优先级合理安排组件重新渲染的时间和方式。

如果把调度器理解为一个复杂函数，它的输入是：

- Fiber
- Lane
- UpdateQueue
- 当前调度状态
- 当前时间戳
- 等等

它没有直接的输出，而是产生一些副作用：

- 标记组件为「有更新」
- 计算优先级，注册调度任务
- 启动渲染阶段

回到上面的一个例子，调度中心收到了更新队列，其中包含了两个 Update 对象：

```
UpdateQueue: Update1 -> Update2
```

下面看看调度器具体的工作。

#### 1.3.2.1 将组件标记为待更新状态

我们之前提到了，我们在内存中有两个对应于真实 dom 的虚拟 dom。

这两个虚拟 dom 本质就是树结构的对象，我们也可以称其为两个 Fiber Node 。

我们常说的 Fiber 架构，就是基于这种树结构的设计。

首先，看第一个问题：为什么使用两个对象？

答案是：参考双缓存机制，获得极大的性能优化。

进一步，我们可以区分这两个对象：称一个为 current node，另一个为 workInProgress node。

current node 对应于当前的真实 dom ，它作用有两个：
1、渲染阶段，基于它生成 workInProgress node；
2、和真实 dom 作 diff 计算。

workInProgress node 是一个对象，react 将下一帧需要更新的内容，首先应用到这个对象上。

需要实际应用更新的时候，切换一下这两个 node 即可。

基于 Update 对象，调度器能够知道并标记需要更新的组件，然后会向上级组件递归传递，直到 root 节点。

#### 1.3.2.2 计算优先级（Lane 模型）

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

#### 1.3.2.3 合并更新

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

下一阶段，在 react 中称为 render 阶段，中文翻译为渲染阶段，这里的渲染和浏览器中基于 cssom 和 dom 生成渲染树的过程类似。

注意：调度器在当前调度工作完成后，可能还有部分任务没有处理。这些任务，将会等待下一次调度的处理。

### 1.3.3 render 阶段

renderRoot 是一个纯计算过程，会：

- 根据旧的 fiber tree；
- 按顺序遍历每个 Hook
- 应用 queue.pending 中的 update，生成新的状态
- 得出新的虚拟 DOM fiber 树（workInProgress node）

至此，调度器的任务完成了，后续就是渲染中心的事。

注意：调度器代码执行期间，浏览器页面并不会发生变化，此时的操作都是内存中对象的修改。

### 1.3.4 commit 阶段

commit 阶段的整体目标是：

- 将渲染阶段生成的 fiber 树（workInProgress）中的变更，真正「提交」到浏览器的真实 DOM 中。

也就是说：

- 渲染阶段只是「算出」要干什么
- 提交阶段才「真正执行」这些事情：修改 DOM、触发副作用、调用生命周期

此时，内存中存在两个 fiber 树，我们之前提到过，一个是 current node，一个是 workInProgress node。

显然，current node 中的 dom 结构和真实 dom 一致，而 workInProgress node 中的 dom 结构就是下一帧会真实 DOM。

commit 阶段会把 workInProgress node 和 current node 做 diff 计算，得到变化的部分。
然后，应用到真实 DOM 中，完成更新。

之后会根据变化的部分，执行生命周期函数和副作用函数。

#### 1.3.4.1 diff 算法

注意之前提到的标记，diff 时能够更具变化标记，支剪大量遍历工作。

diff 算法会检查逐层变了 node，如果没有变化标记，就不再处理。

如果需要修改，则会确定修改的方式：新增、删除、修改。

在这个过程中，react 会根据 key 来选择复用某些节点，减少不必要的操作。

这里有个常见的问题：为什么不能推荐使用数组的 index 来做 key ?

答案是：React 在「列表渲染」中使用 key 来识别每个列表项，区分哪些元素被插入、删除、移动或复用。当数组发生变化（特别是中间插入/删除）时，会导致「错误的复用」，造成页面状态错乱！

### 1.3.5 小结

commit 之后，页面中的真实 DOM 就会被更新。

这一帧的更新就完成了，之后会等待下一次更新。

值得一提的是：虚拟 DOM 的设计，可以支持跨端。

在 commit 阶段之前的工作，都是在内存中进行的，不涉及具体的环境 —— pc 浏览器或手机屏幕。

于是，利用不同的 commit 工具（react native），既可以把 react 代码应用到其他终端上。

## 1.4 总结

react 设计原理的核心，是调度器、渲染中心和提交中心这三个核心模块的协同工作。

调度器负责管理更新任务，渲染中心负责计算更新，提交中心负责更新 DOM。

在这个过程中，react 会根据优先级，合并更新任务，提高更新效率。

这就是 react 的设计原理，它是一个复杂的系统，需要不断地学习和探索。

## 1.5 参考资料

- 《react 设计原理(卡颂)》
- React 官网
- chatGpt
