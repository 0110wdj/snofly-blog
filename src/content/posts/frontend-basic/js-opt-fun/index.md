---
title: 从兴趣和收益的角度优化 javascript 代码
published: 2024-11-18
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

## 2 避免不同的结构/形状

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

## 5 避免缓存未命中

This point requires a bit of low-level knowledge, but has implications even in javascript, so I’ll explain. From the CPU point of view, retrieving memory from RAM is slow. To speed things up, it uses mainly two optimizations.

虽然这一节讨论的是底层知识，但在 javascript 中也有同样的影响，所以我会解释一下。从 CPU 的角度来看，从 RAM 中检索内存是缓慢的。为了加速，它主要使用两种优化。

### 5.1 预取(refetching)

第一种是**预取(refetching)**：它提前获取更多的内存，并希望这是你感兴趣的内存。

它总是猜测，如果你请求一个内存地址，那么你将对紧随其后的内存区域感兴趣。所以**按顺序访问数据**是关键。

在下面的示例中，我们可以观察到随机访问内存的影响。

```js
// setup:
const K = 1024;
const length = 1 * K * K;

// 这些点是一个接一个创建的，所以它们在内存中是按顺序分配的。
const points = new Array(length);
for (let i = 0; i < points.length; i++) {
  points[i] = { x: 42, y: 0 };
}

// 这个数组包含与上面相同的数据，但以随机顺序排列。
const shuffledPoints = shuffle(points.slice());
```

```js
// 1. sequential
let _ = 0;
for (let i = 0; i < points.length; i++) {
  _ += points[i].x;
}
```

```js
// 2. random
let _ = 0;
for (let i = 0; i < shuffledPoints.length; i++) {
  _ += shuffledPoints[i].x;
}
```

基准测试结果：

- 1. sequential: 100%
- 2. random: 26.22%

#### 我应该怎么办？

这方面可能是最难付诸实践的，因为 javascript 没有在内存中放置对象的方法。

但是你可以使用上文例子中的知识去优化：例如在顺序改变之前对数据进行操作。

你不能假设顺序创建的对象在一段时间后会保持在同一位置，因为 gc 可能会移动它们。

有一个例外，它是数字数组，最好是 TypedArray 实例：

```js
// from this
const points = [
  { x: 0, y: 5 },
  { x: 0, y: 10 },
];

// to this
const points = new Int64Array([0, 5, 0, 10]);
```

查看更多详细的例子，查看[这个链接](https://mrale.ph/blog/2018/02/03/maybe-you-dont-need-rust-to-speed-up-your-js.html#optimizing-parsing---reducing-gc-pressure)。

> 请注意，它包含一些现在已经过时的优化，但总体上仍然是准确的。

### 5.2 L1/2/3 缓存(Caching in L1/2/3)

第二种 CUP 使用的优化是 L1/L2/L3 缓存：它们好比更快的 RAM，但也更昂贵，所以也更小。它们包含 RAM 数据，但充当 LRU 缓存。数据在工作时进入，并在新的工作数据需要空间时写回主 RAM。因此，这里的关键是**使用尽可能少的数据**来将工作数据集保存在快速缓存中。

在下面的示例中，我们可以观察破坏每个连续缓存后的影响。

```js
// setup:
const KB = 1024;
const MB = 1024 * KB;

const L1 = 256 * KB;
const L2 = 5 * MB;
const L3 = 18 * MB;
const RAM = 32 * MB;

// 对于所有测试用例，我们将访问相同的缓冲区。
// 但是不同的测试用例，只会访问部分区间。比如第一个用例只会访问到 buffer 的 0 - L1 区间，第二个用例只会访问到 0 - L2 区间，以此类推。
const buffer = new Int8Array(RAM);
buffer.fill(42);

const random = (max) => Math.floor(Math.random() * max);
```

```js
// 1. L1
let r = 0;
for (let i = 0; i < 100000; i++) {
  r += buffer[random(L1)];
}
```

```js
// 2. L2
let r = 0;
for (let i = 0; i < 100000; i++) {
  r += buffer[random(L2)];
}
```

```js
// 3. L3
let r = 0;
for (let i = 0; i < 100000; i++) {
  r += buffer[random(L3)];
}
```

```js
// 4. RAM
let r = 0;
for (let i = 0; i < 100000; i++) {
  r += buffer[random(RAM)];
}
```

基准测试结果：

- 1. L1: 100%
- 2. L2: 78.06%
- 3. L3: 65.89%
- 4. RAM: 29.33%

#### 我应该怎么办？

消除每一个可以消除的数据或内存分配。数据集越小，程序的运行速度就越快。内存 I/O 是 95% 的程序的瓶颈。另一个好的策略是将你的工作拆分，确保你每次只处理一个小的数据集。

更多 CPU 和内存的细节信息，可以[查看这个](https://people.freebsd.org/~lstewart/articles/cpumemory.pdf)。

> 关于不可变数据结构
> 对于清晰度和正确性来说，不可变性是很好的，但是在性能方面，更新不可变数据结构意味着创建容器的副本，这就需要更多的内存 I/O 来刷新缓存。你应该尽可能避免不可变数据结构。

> 关于解构运算 {...rest}
> 它非常方便，但每次使用它时都会在内存中创建一个新对象。更多的内存 I/O，更慢的缓存！（More memory I/O, slower caches!）

## 6 避免大型对象

Hashmaps are prone to this because their data is usually randomly & evenly distributed over the memory region they occupy. Let’s see how it behaves with this map of some users indexed by their ID.

如第 2 节所述，引擎使用结构(shapes)来优化对象。

但是，当结构变得太大时，引擎别无选择，只能使用常规的 hashmap（如 Map 对象）。

正如我们在第 5 节中看到的，缓存缺失会显著降低性能。

hashmap 很容易出现这种情况，因为它们的数据通常是随机且均匀地分布在它们所占用的内存区域上。

让我们看看它是如何处理这个由用户 ID 索引的用户映射的。

```js
// setup:
const USERS_LENGTH = 1_000;
```

```js
// setup:
const byId = {};
Array.from({ length: USERS_LENGTH }).forEach((_, id) => {
  byId[id] = { id, name: "John" };
});
let _ = 0;
```

```js
// 1. [] access
Object.keys(byId).forEach((id) => {
  _ += byId[id].id;
});
```

```js
// 2. direct access
Object.values(byId).forEach((user) => {
  _ += user.id;
});
```

基准测试结果：

- 1. \[ \] access: 43.18%
- 2. direct access: 100%

我们还可以观察到，随着对象大小的增长，性能是如何不断下降的：

```js
// setup:
const USERS_LENGTH = 100_000;
```

基准测试结果：

- 1. \[ \] access: 20.67%
- 2. direct access: 100%

#### 我应该怎么办？

如上所示，避免频繁索引大型对象。最好事先将对象转换为数组。组织数据以获得模型上的 ID 会有所帮助，因为可以使用 Object.values()，而不必引用键映射来获取 ID。

## 7 使用 eval

有些 javascript 模式(patterns)很难针对引擎进行优化，通过使用 eval() 或其衍生物，可以使这些模式消失。

在这个例子中，我们可以看到 eval() 是如何避免“创建带有动态对象键的对象”的开销的：

```js
// setup:
const key = "requestId";
const values = Array.from({ length: 100_000 }).fill(42);
```

```js
// 1. without eval
function createMessages(key, values) {
  const messages = [];
  for (let i = 0; i < values.length; i++) {
    messages.push({ [key]: values[i] });
  }
  return messages;
}

createMessages(key, values);
```

```js
// 2. with eval
function createMessages(key, values) {
  const messages = [];
  const createMessage = new Function(
    "value",
    `return { ${JSON.stringify(key)}: value }`
  );
  for (let i = 0; i < values.length; i++) {
    messages.push(createMessage(values[i]));
  }
  return messages;
}

createMessages(key, values);
```

基准测试结果：

- 1. without eval: 53.2%
- 2. with eval: 100%

eval 的另一个好的用例可能是编译一个过滤器谓词函数，在该函数中丢弃你知道永远不会使用的分支。

一般来说，任何将在热循环中运行的函数都是这种优化的良好候选者。

显然，关于 eval() 的常见警告仍然适用：不要相信用户输入，对传递到 eval() 代码中的任何内容进行消毒，并且不要创建任何 XSS 的可能性。还要注意，有些环境不允许访问 eval()，例如带有 CSP 的浏览器页面。

## 8 谨慎使用字符串

我们已经在前文看到字符串比它们表面上开销更大。

现在我有一个好消息和一个坏消息，总所周知，当然是先说坏消息：字符串比它们看起来更复杂。然后是好消息：但它们也可以非常有效地被使用。

基于上下文关系，字符串的操作是 JavaScript 的核心部分。

为了优化存在大量字符串的代码，JS 引擎的作法必须具有创造性。

我的意思是，他们必须根据实际情况，使用 c++ 中的"多字符串形式"(multiple string representation)来表示 String 对象。

这里有两种一般情况值得关注，因为它们适用于 V8(到目前为止最常见的引擎)，通常也适用于其他引擎。

**首先**，用 + 连接字符串的操作，不会创建两个输入字符串的副本，而是创建一个指向每个子字符串的指针。

如果是 typescript 中的话，应该是这样的：

```js
class String {
  abstract value(): char[] {}
}

class BytesString {
  constructor(bytes: char[]) {
    this.bytes = bytes
  }
  value() {
    return this.bytes
  }
}

class ConcatenatedString {
  constructor(left: String, right: String) {
    this.left = left
    this.right = right
  }
  value() {
    return [...this.left.value(), ...this.right.value()]
  }
}

function concat(left, right) {
  return new ConcatenatedString(left, right)
}

const first = new BytesString(['H', 'e', 'l', 'l', 'o', ' '])
const second = new BytesString(['w', 'o', 'r', 'l', 'd'])

// 看嘛，没有真的复制!
const message = concat(first, second)
```

**其次**，字符串切片的操作，也不需要创建副本：它们可以简单地指向另一个字符串中的范围。

继续用上面的例子：

```js
class SlicedString {
  constructor(source: String, start: number, end: number) {
    this.source = source;
    this.start = start;
    this.end = end;
  }
  value() {
    return this.source.value().slice(this.start, this.end);
  }
}

function substring(source, start, end) {
  return new SlicedString(source, start, end);
}

// 这能表示 "He"，但它仍然不包含任何数据副本。
const firstTwoLetters = substring(message, 0, 2);
```

但这里有一个问题：一旦你需要去改变这些 bytes，那么就是开销复制成本的时刻。

让我们回顾 String 类，然后尝试添加一个 .trimend 方法：

```js
class String {
  abstract value(): char[] {}

  trimEnd() {
    const bytes = this.value()
    const result = bytes.slice()
    while (result[result.length - 1] === ' '){
      result.pop()
    }
    return new BytesString(result)
  }
}
```

那么让我们来看一个例子，在这个例子中，我们比较了**使用突变操作**和**只使用连接操作**：

```js
// setup:
const classNames = ["primary", "selected", "active", "medium"];
```

```js
// 1. mutation
const result = classNames.map((c) => `button--${c}`).join(" ");
```

```js
// 2. concatenation
const result = classNames
  .map((c) => "button--" + c)
  .reduce((acc, c) => acc + " " + c, "");
```

基准测试结果：

- 1. mutation: 37.43%
- 2. concatenation: 100%

#### 我应该怎么办？

一般来说，**尽量避免突变**。这包括 .trim() .replace() 等方法。考虑一下如何避免这些方法。在某些引擎中，字符串模板也可能比 + 操作慢。目前在 V8 中是这样的，但将来可能不会，所以还得靠基准测试。

关于上面的 SlicedString 的注意事项：如果我们使用的字符串，是内存中的一个非常大的字符串的子字符串，它可能会阻止 gc 收集大字符串！

如果你正在处理大文本并从中提取小字符串，则可能会泄漏大量内存。

```js
const large = Array.from({ length: 10_000 })
  .map(() => "string")
  .join("");
const small = large.slice(0, 50);
//    ^ will keep `large` alive
```

这里的解决方案是使用对我们有利的变异方法。

如果我们改变小字符串的一个字符，那么小字符串将被强制复制，并且原来指向大字符串的指针将丢失：

```js
// replace a token that doesn't exist
const small = small.replace("#".repeat(small.length + 1), "");
```

有关更多细节，请参阅 [V8 中的 string.h](https://github.com/v8/v8/blob/main/src/objects/string.h) 或 [JavaScriptCore 中的 JSString.h](https://github.com/WebKit/WebKit/blob/main/Source/JavaScriptCore/runtime/JSString.h)。

> 关于字符串复杂性:
> 我很快浏览了一遍，但是有很多实现细节增加了字符串的复杂性。每种字符串表示通常都有最小长度。例如，连接字符串可能不适用于非常小的字符串。或者有时存在限制，例如避免指向子字符串的子字符串。阅读上面链接的 c++ 文件可以很好地了解实现细节 —— 即使只是阅读注释。

## 9 使用专业化(specialization)

性能优化中的一个重要概念是专业化：调整代码逻辑以适应特定用例的约束。这通常意味着弄清楚哪些条件可能适合你的例子，并针对这些条件进行编码。

假设我们是一个商家，有时需要将标签添加到产品列表中。根据经验，我们知道标签通常是空的。知道了这些信息，我们就可以针对这种情况对函数进行专门的优化：

```js
// setup:
const descriptions = ["apples", "oranges", "bananas", "seven"];
const someTags = {
  apples: "::promotion::",
};
const noTags = {};

// 将产品转换成字符串，再加上可能存在的标签
function productsToString(description, tags) {
  let result = "";
  description.forEach((product) => {
    result += product;
    if (tags[product]) result += tags[product];
    result += ", ";
  });
  return result;
}

// 现在来优化一下啊
function productsToStringSpecialized(description, tags) {
  // 我们知道 `tags` 很可能是空的，所以我们提前检查一次，然后我们就可以从内部循环中删除 `if` 检查
  if (isEmpty(tags)) {
    let result = "";
    description.forEach((product) => {
      result += product + ", ";
    });
    return result;
  } else {
    let result = "";
    description.forEach((product) => {
      result += product;
      if (tags[product]) result += tags[product];
      result += ", ";
    });
    return result;
  }
}
function isEmpty(o) {
  for (let _ in o) {
    return false;
  }
  return true;
}
```

```js
// 1. not specialized
for (let i = 0; i < 100; i++) {
  productsToString(descriptions, someTags);
  productsToString(descriptions, noTags);
  productsToString(descriptions, noTags);
  productsToString(descriptions, noTags);
  productsToString(descriptions, noTags);
}
```

```js
// 2. specialized
for (let i = 0; i < 100; i++) {
  productsToStringSpecialized(descriptions, someTags);
  productsToStringSpecialized(descriptions, noTags);
  productsToStringSpecialized(descriptions, noTags);
  productsToStringSpecialized(descriptions, noTags);
  productsToStringSpecialized(descriptions, noTags);
}
```

基准测试结果：

- 1. not specialized: 85.71%
- 2. specialized: 100%

这种类型的优化可以只给你适度的改进，但这些会累积起来。它们是对更关键的优化(如形状和内存 I/O)的一个很好的补充。

但请注意，一旦条件发生变化，反而可能造成负面效果，因此在应用此方法时要小心。

> 分支预测和无分支代码:
> 从代码中删除分支可以非常有效地提高性能。有关分支预测器的更多细节，请阅读经典的堆栈溢出回答[为什么处理排序数组更快](https://stackoverflow.com/questions/11227809/why-is-processing-a-sorted-array-faster-than-processing-an-unsorted-array)。

## 10 数据结构

我不会详细介绍数据结构，因为它们需要单开一章。

但是请注意，如果你的用例使用了不正确的数据结构，那么可能会产生**比上述任何优化更大的负面效果**。

我建议你熟悉一下原生的 Map 和 Set ，然后了解一下链表、优先级队列、树（RB 和 B+），最后尝试用一下。

但是作为一个简单的例子，让我们比较一下 Array.includes 和 Set.has 在一个小列表中的表现：

```js
// setup:
const userIds = Array.from({ length: 1_000 }).map((_, i) => i);
const adminIdsArray = userIds.slice(0, 10);
const adminIdsSet = new Set(adminIdsArray);
```

```js
// 1. Array
let _ = 0;
for (let i = 0; i < userIds.length; i++) {
  if (adminIdsArray.includes(userIds[i])) {
    _ += 1;
  }
}
```

```js
// 2. Set
let _ = 0;
for (let i = 0; i < userIds.length; i++) {
  if (adminIdsSet.has(userIds[i])) {
    _ += 1;
  }
}
```

基准测试结果：

- 1. Array: 34.27%
- 2. Set: 100%

如你所见，数据结构的选择会产生非常大的影响。

我有一个真实的例子：将数组切换为一个链表，[函数的运行时间从 5 秒减少到 22 毫秒](https://github.com/mui/mui-x/pull/9200)。

## 11 基准测试(Benchmarking)

把这一节留到最后的原因是，我需要通过前面有趣的章节建立可信度。

现在我（希望）已经掌握了它，我要告诉你的是：基准测试是优化中最重要的部分。而且不仅是最重要的，也是最难的。

即使有着 20 年的经验，我有时仍然会创建有缺陷的基准，或者错误地使用分析工具。

所以无论你想做什么，请先**尽力做正确的基准测试**。

### 11.0 从最关键的开始(Start with the top)

你的首要优化任务，始终是针对运行时占比最大的函数或代码片段。

如果你花时间优化这些之外的任何东西，那么你就是在浪费时间。

### 11.1 避免微基准测试

在生产模式下运行你的代码，然后基于观察的结果进行优化。

JS 引擎非常复杂，在微基准测试(micro-benchmark)中的表现通常与在真实场景中的表现不同。

例如，以这个微基准测试为例：

```js
const a = { type: "div", count: 5 };
const b = { type: "span", count: 10 };

function typeEquals(a, b) {
  return a.type === b.type;
}

for (let i = 0; i < 100_000; i++) {
  typeEquals(a, b);
}
```

如果你前文有注意看的话，就会意识到，这里 JS 引擎会专门为这个结构({type: string， count: number})优化函数。

但这个说法在实际用例中还能成立呢？a 和 b 总是那种结构吗，还是你会得到任何其他结构？

如果你的函数，在生产中接收到很多种结构，那么该函数的行为将有所不同。

### 11.2 怀疑结果

如果你刚刚优化了一个函数，现在它的运行速度提高了 100 倍，先怀疑一下。

尝试推翻你的结果，在生产模式下测试，给它增加负载。

同样地，也要对你的工具保持怀疑。

仅仅通过 devtools 观察一个基准测试就可能会改变它的行为。

### 11.3 选择你的目标

不同的引擎对某些模式的优化效果可能会有所不同。你应该针对与你相关的引擎进行基准测试，并优先考虑哪个引擎对你更重要。

[这是 Babel 中的一个真实例子](https://github.com/babel/babel/pull/16357)，其中改进 V8 意味着降低 JSC 的性能。

## 12 分析和工具

关于性能分析和开发工具的各种说明。

### 12.1 浏览器陷阱

如果你在浏览器中进行性能分析，请确保使用空白的浏览器配置文件。我甚至使用一个单独的浏览器来进行这项工作。

如果你在进行性能分析时启用了浏览器扩展，那么它们可能会干扰测量结果。尤其是 React devtools 会显著影响结果，渲染代码的速度可能比用户看到的更慢。

### 12.2 样品分析 vs 结构分析

浏览器分析工具(profiling tools)是基于样本的分析工具，它定期对你的堆栈进行采样。

这有一个很大的缺点：在这些样本之间可能会调用非常小但非常频繁的函数，并且可能在你得到的堆栈图中被严重低估。

可以使用 Firefox 开发者工具并设置自定义采样间隔，或使用 Chrome 开发者工具的 CPU 降速功能来缓解这个问题。

### 12.3 业内工具

除了常规的浏览器开发工具，了解这些选项可能会有所帮助：

- Chrome 开发工具有很多[实验性选项](https://github.com/iamakulov/devtools-perf-features)，可以帮助你找出性能缓慢的原因。样式失效跟踪器在需要调试浏览器中的样式或布局重新计算时非常有用。

- [deoptexplorer-vscode](https://github.com/microsoft/deoptexplorer-vscode) 扩展允许你加载 V8/chromium 日志文件以了解代码何时触发去优化，比如当你将不同的结构传递给函数的时候。虽然你不用该扩展也可以读取日志文件，但它让体验更加友好。

- 你可以为每个 JS 引擎编译 debug shell，以此更详细地了解其工作原理。这样可以运行 perf 等底层工具，还可以检查每个引擎生成的字节码和机器代。
  [V8 示例](https://mrale.ph/blog/2018/02/03/maybe-you-dont-need-rust-to-speed-up-your-js.html#getting-the-code)|[示例 JSC 示例](https://zon8.re/posts/jsc-internals-part1-tracing-js-source-to-bytecode/)|示例 SpiderMonkey

## 最后

希望你学到了一些有用的技巧。如果你有任何评论、更正或问题，请在页脚发电子邮件。我总是很高兴收到读者的反馈或问题。
