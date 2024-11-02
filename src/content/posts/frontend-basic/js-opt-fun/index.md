---
title: 从兴趣和收益的角度优化 javascript 代码
published: 2024-10-21
description: ""
image: ""
tags: ["js", "翻译"]
category: "前端入门"
draft: false
---

# 前言

## 译者述

1、原文来自 romgrk 个人网站上的一篇文章： [Optimizing Javascript for fun and for profit](https://romgrk.com/posts/optimizing-javascript)。

2、这是一篇关于 js 编码优化的文章, 发布于 2024 年 3 月 21 日。

3、翻译中会尽量遵照原意, 也会加入译者的技术注释, 以及选择更符合汉语文法的译句。

4、感谢阅读，欢迎指正。

# 正文

## 关于基准测试

我经常觉得 js 代码的执行速度远远不及最佳速度，而这仅仅是因为缺少适当的优化。本文是我收集的一些常用优化技术的总结。

注意，性能和可读性总是难以兼顾的，而至于怎么权衡，则是留给读者自己的问题。

我也注意到，要讨论优化问题，必须要先讨论**基准测试(benchmarking)**。如果一个函数只占实际总运行时间的一小部分，那么即使花几个小时对该函数进行微优化(micro-optimizing)——使其运行速度提高 100 倍，也是没有意义的。如果要进行优化，最先最重要的一步就是基准测试。我将在后文的优化要点中讨论这个主题。

还要注意，微基准测试(micro-benchmarks)通常是有缺陷的，可能后文中提到的微基准测试也存在缺陷。我已经尽了最大努力避免这些陷阱，但不要在没有基准测试的情况下盲目地应用后文提出的任何优化要点。

## 关于可运行示例

我尽可能在每个部分都留下了可运行的示例。它们默认显示我在我的机器上得到的结果（在 archlinux 上是 brave 122），但你也可以自己运行它们试试。

> （译者注：这些示例包含一个初始值（作者机器上跑出来的结果），还包含一个可在线运行的脚本，本译文不处理改脚本。如果读者想运行程序看看效果，可以复制代码本地运行，或者去原文运行在线示例。）

虽然我不想这么说，但火狐浏览器在优化方面有点落后，而且只占市场份额的很小一部分，所以我不建议使用火狐浏览器的结果作为衡量的指标。

## 0 避免工作

这听起来很简单，但却是最优先的优化步骤：如果你试图优化，你应该首先考虑**避免工作**。这里有一些概念：缓存(memoization)、惰性计算(laziness)、增量计算(incremental computation)。它们将根据上下文以合适的方式应用。比如说在 React 中，就是使用 memo 、useMemo 和其他合适的语法。

## 1 避免字符串比较

Javascript 悄无声息地隐藏了字符串比较的实际开销。

如果你需要在 C 语言中比较字符串，你需要使用 strcmp 函数。而在 Javascript 中，使用 `===` 运算符，这样就看不见 strcmp 函数了。但它是存在的，字符串比较通常需要将字符串中的每个字符与另一个字符串中的字符进行比较，时间复杂度为 Ο(n)。

要避免的一种常见写法是**字符串作为枚举**。但随着 TypeScript 的出现，这应该很容易避免，因为 enum 默认是整数。

```ts
// No
enum Position {
  TOP = "TOP",
  BOTTOM = "BOTTOM",
}
```

```ts
// Yes
enum Position {
  TOP, // = 0
  BOTTOM, // = 1
}
```

这里是一个实际开销的比较：

```js
// 1. string compare
const Position = {
  TOP: "TOP",
  BOTTOM: "BOTTOM",
};

let _ = 0;
for (let i = 0; i < 1000000; i++) {
  let current = i % 2 === 0 ? Position.TOP : Position.BOTTOM;
  if (current === Position.TOP) _ += 1;
}
```

```js
// 2. int compare
const Position = {
  TOP: 0,
  BOTTOM: 1,
};

let _ = 0;
for (let i = 0; i < 1000000; i++) {
  let current = i % 2 === 0 ? Position.TOP : Position.BOTTOM;
  if (current === Position.TOP) _ += 1;
}
```

基准测试结果：

- 1、string 50.35%
- 2、int 100%

> 关于基准(benchmarks):
> 百分比结果表示：两段程序在 1 秒内的操作次数，除以两个操作数中的最大值。百分比更大，表示性能更好。

如上所示，两者差距显著。这种差异不一定是使用 strcmp 函数的开销，因为 JS 引擎有时会使用**字符串池**，然后通过引用来比较。

在 JS 引擎中，整数通常是按值传递的，字符串则是按引用（指针）传递的。内存访问的代价是昂贵的（见第五节），在字符串很多的代码中，这会产生很严重的影响。

举个现实的例子，我能够使[这个 JSON5 js 解析器](https://github.com/json5/json5/pull/278)（遗憾的是，这个改动并没有被合并，但这就是开源的魅力之处）运行速度提高两倍，而改变仅仅是将字符串常量替换为数字。

## 2 避免不同的结构

JS 引擎有一种默认的优化：先假设对象具有相特定的结构，且假设函数的参数对象具有相同的结构，然后就只需要存储一次对象的 keys，然后单独用一个数据存储对象的 values。

如下所示：

```js
// 比如这些对象的结构是一致的
const objects = [
  {
    name: "Anthony",
    age: 36,
  },
  {
    name: "Eckhart",
    age: 42,
  },
  {
    name: "a",
    age: 1,
  },
  {
    name: "b",
    age: 2,
  },
  {
    name: "c",
    age: 3,
  },
  {
    name: "d",
    age: 4,
  },
  {
    name: "e",
    age: 5,
  },
  {
    name: "f",
    age: 6,
  },
  {
    name: "g",
    age: 7,
  },
  {
    name: "h",
    age: 8,
  },
  {
    name: "i",
    age: 9,
  },
  {
    name: "j",
    age: 10,
  },
];
```

```js
// 于是，使用这样的存储结构，显然能够减少很多重复字符
const shape = [
  { name: "name", type: "string" },
  { name: "age", type: "integer" },
];

const objects = [
  ["Anthony", 36],
  ["Eckhart", 42],
  ["a", 1],
  ["b", 2],
  ["c", 3],
  ["d", 4],
  ["e", 5],
  ["f", 6],
  ["g", 7],
  ["h", 8],
  ["i", 9],
  ["j", 10],
];
```

> 关于术语的说明：
> 我使用了 shap 这个词来描述这个概念，但要注意，你也可以使用 hidden class 或 map 来描述它，这取决于引擎。

> （译者注：为了增加对比性，译者增加了示例的内容。另外，原文使用 shap 这个单词，但是翻译不是“形状”，而是“结构”，因为“结构”这个词更能说明数量和类型。）

举个例子，在运行时，如果下面这个函数，接收到的两个参数的结构都是 {x:number,y:number}, 那么引擎将推测未来的参数都是这样的结构，然后就能生成针对性的机器代码。

```js
function add(a, b) {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  };
}
```

一旦传递的对象结构不再是 {x,y} —— 比如改为 {y,x}, 那么引擎就会撤销它的推测（相当于放弃这种优化），然后函数就会突然变得相当慢了。

我尽量减少相关的解释，如果你想了解更多细节，你应该去看看 [mraleph 文章](https://mrale.ph/blog/2015/01/11/whats-up-with-monomorphism.html) 的解释。

这里我要强调的是，V8 中有 3 种特别的模式，以对应不同的访问方式:

- 单态 —— 只有一种结构
- 多态 —— 有 2-4 种结构
- 亚态 —— 5 种以上的结构

> (译者述：原文描述为 monomorphic (1 shape), polymorphic (2-4 shapes), and megamorphic (5+ shapes))

要我说，你就应该保持单态模式，因为它的效率最高。

```js
// setup
let _ = 0;
```

```js
// 1. monomorphic
const o1 = { a: 1, b: _, c: _, d: _, e: _ };
const o2 = { a: 1, b: _, c: _, d: _, e: _ };
const o3 = { a: 1, b: _, c: _, d: _, e: _ };
const o4 = { a: 1, b: _, c: _, d: _, e: _ };
const o5 = { a: 1, b: _, c: _, d: _, e: _ }; // all shapes are equal
```

```js
// 2. polymorphic
const o1 = { a: 1, b: _, c: _, d: _, e: _ };
const o2 = { a: 1, b: _, c: _, d: _, e: _ };
const o3 = { a: 1, b: _, c: _, d: _, e: _ };
const o4 = { a: 1, b: _, c: _, d: _, e: _ };
const o5 = { b: _, a: 1, c: _, d: _, e: _ }; // this shape is different
```

```js
// 3. megamorphic
const o1 = { a: 1, b: _, c: _, d: _, e: _ };
const o2 = { b: _, a: 1, c: _, d: _, e: _ };
const o3 = { b: _, c: _, a: 1, d: _, e: _ };
const o4 = { b: _, c: _, d: _, a: 1, e: _ };
const o5 = { b: _, c: _, d: _, e: _, a: 1 }; // all shapes are different
```

```js
// test case
function add(a1, b1) {
  return a1.a + a1.b + a1.c + a1.d + a1.e + b1.a + b1.b + b1.c + b1.d + b1.e;
}

let result = 0;
for (let i = 0; i < 1000000; i++) {
  result += add(o1, o2);
  result += add(o3, o4);
  result += add(o4, o5);
}
```

基准测试结果：

- 1. monomorphic: 100%
- 2. polymorphic: 13.07%
- 3. megamorphic: 4.09%

### 对此，我到底应该怎么办？

只需要保证你的对象都有相同的结构就行了。

但是说起来容易做起来难，即使是编写 recat 组件 props 顺序不同这样的事情，也会导致退出单态模式。

举个例子：
我在 React 的代码库中发现了一个 [简单的例子](https://github.com/facebook/react/pull/28569)，但在几年前他们有一个 [更严重的类似的问题](https://v8.dev/blog/react-cliff) —— 他们用整数初始化了一个对象，但是又存储浮点数。

没错，改变 number 类型也会改变结构，number 隐含着 integer 和 float 两种类型。这是需要处理的。

> 关于 number 的表示：
> 引擎通常可以将整数编码为值。例如，V8 以 32 位表示值，小整数作为紧凑的 [Smi](https://medium.com/fhinkel/v8-internals-how-small-is-a-small-integer-e0badc18b6da)值，但浮点数和大整数像字符串和对象一样作为指针传递。
> JSC 使用 64 位编码，[双标记](https://ktln2.org/2020/08/25/javascriptcore/)，按值传递所有数字，其余的作为指针传递。

## 3 避免数组或对象方法

我和大多数人一样喜欢函数式(functional)编程，但除非你在 Haskell/OCaml/Rust 这种能将“函数式代码”高效编译成“机器代码”的环境中工作，否则函数式总是慢于命令式(imperative)的。

```js
const result = [1.5, 3.5, 5.0]
  .map((n) => Math.round(n))
  .filter((n) => n % 2 === 0)
  .reduce((a, n) => a + n, 0);
```

这些方法的问题在于：

1、它们需要生成数组的完整副本，这些副本稍后需要由 gc 释放。（我们在第五节会讨论内存 I/O 的更多细节）
2、它们对 N 个操作遍历 N 次，而 for 循环只需要遍历一次。

```js
// setup:
const numbers = Array.from({ length: 10_000 }).map(() => Math.random());
```

```js
// 1. functional
const result = numbers
  .map((n) => Math.round(n * 10))
  .filter((n) => n % 2 === 0)
  .reduce((a, n) => a + n, 0);
```

```js
// 2. imperative
let result = 0;
for (let i = 0; i < numbers.length; i++) {
  let n = Math.round(numbers[i] * 10);
  if (n % 2 !== 0) continue;
  result = result + n;
}
```

基准测试结果：

- 1. functional: 36.51%
- 2. imperative: 100%

例如 Object.values(), Object.keys() 和 Object.entries() 等方法也存在类似的问题，因为它们也会申请分配更多的数据空间，而内存访问是所有性能问题的根源。

No really I swear，我会在第五节讨论内存问题。

> （译者注：原文是：“No really I swear, I’ll show you in section 5.”，总感觉作者很皮。）

## 4 避免间接访问(Avoid indirection)

另一个优化收益的点是减少使用**间接源**(source of indirection) —— 主要是这三种间接源：

- 使用代理
- 多层嵌套访问
- 多层函数调用

```js
const point = { x: 10, y: 20 };

// 1.
// Proxy 对象难以被优化，因为它们的 get/set 函数可能会运行自定义逻辑，所以引擎无法做出他们的一般假设。
const proxy = new Proxy(point, {
  get: (t, k) => {
    return t[k];
  },
});
// 有些引擎可以使代理成本消失，但这些优化是昂贵的，并且容易出错。
const x = proxy.x;

// 2.
// 通常被忽视，但通过 `.` 或 `[]` 访问对象也是一个间接源。在简单的情况下，引擎可能会优化掉这些成本：
const x = point.x;
// 但是，每个额外的访问都将增加成本，并且使引擎难以做出关于 point 状态的一般假设：
const x = this.state.circle.center.point.x;

// 3.
// 最后，函数调用也可能有成本。引擎通常能够内联这些函数：
function getX(p) {
  return p.x;
}
const x = getX(p);
// 但是，这并不能确保优化。例如，如果这个函数调用不是来自静态函数：
function Component({ point, getX }) {
  return getX(point);
}
```

目前，Proxy 的基准测试结果在 V8 上非常糟糕。上次我检查时，代理对象总是从 JIT 回退到解释器，从这些结果来看，情况可能仍然如此。

```js
// 1. proxy access
const point = new Proxy({ x: 10, y: 20 }, { get: (t, k) => t[k] });

for (let _ = 0, i = 0; i < 100_000; i++) {
  _ += point.x;
}
```

```js
// 2. direct access
const point = { x: 10, y: 20 };
const x = point.x;

for (let _ = 0, i = 0; i < 100_000; i++) {
  _ += x;
}
```

基准测试结果：

- 1. proxy access: 2.8%
- 2. direct access: 100%

我还想展示访问深度嵌套对象与直接访问的对比，但是当存在热循环(hot loop)和常量对象时，引擎非常擅长[通过 escape 分析优化对象访问](https://www.youtube.com/watch?v=KiWEWLwQ3oI&t=1055s)。于是我插入了一点间接的东西来防止这种优化。

```js
// 1. nested access
const a = { state: { center: { point: { x: 10, y: 20 } } } };
const b = { state: { center: { point: { x: 10, y: 20 } } } };
const get = (i) => (i % 2 ? a : b);

let result = 0;
for (let i = 0; i < 100_000; i++) {
  result = result + get(i).state.center.point.x;
}
```

```js
// 2. direct access
const a = { x: 10, y: 20 }.x;
const b = { x: 10, y: 20 }.x;
const get = (i) => (i % 2 ? a : b);

let result = 0;
for (let i = 0; i < 100_000; i++) {
  result = result + get(i);
}
```

基准测试结果：

- 1. nested access: 42.08%
- 2. direct access: 100%

## 5. 避免缓存丢失
