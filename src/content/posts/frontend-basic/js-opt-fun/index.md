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

> （译者注：这个示例包含一个初始值（作者机器上跑出来的结果），然后就是在当前 js 执行引擎中执行的结果。这里的交互效果，是译者写的 js 脚本，和原文的实现效果可能不同。）

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
