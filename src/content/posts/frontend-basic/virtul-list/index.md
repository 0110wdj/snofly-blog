---
title: 由虚拟列表到引发的思考
published: 2025-06-16
description: ""
image: ""
tags: ["js"]
category: "前端入门"
draft: true
---

# 前言

## 作者述

一般认为：超过 1000 行 + 多列（10+），或者含复杂内容的表格，就可以开始视为“大数据量”，需要进行优化考虑。

对于大数据量的表格页面，我们一般考虑使用虚拟列表去渲染可视区域的行列 dom 元素，这样在性能上能够得到很大的提升。

本文将给出虚拟列表的实现原理，然后讨论在哪些方面提升了性能，以及到底提升了多少（量化）。

## 预备知识

- 前端三件套基础知识

本文使用 html、css、js 编写 demo 代码，专注研究虚拟列表的实现原理。

## 本文目标

理解虚拟滚动原理，提高对浏览器的认知。

- 能够实现虚拟列表代码
- 了解浏览器的渲染机制
- 了解性能测量方法

# rc-virtual-list 中的实现原理

本文考虑两种情况下的虚拟列表：

- 列表项高度固定
- 列表项高度不固定

针对不同的情况，我们会采取不同的策略：

- 列表项高度固定：我们会根据可视区域的高度，计算出可视区域内最多能展示多少个列表项。然后我们只渲染这部分列表项，超出可视区域的列表项不渲染。
- 列表项高度不固定：在这种情况下，我们无法直接根据可视区域的高度来计算出最多能展示多少个列表项，还需要增加额外的处理逻辑。

首先看看常用工具库中，是怎么设计的。(本文使用 rc-virtual-list@3.19.1 版本，不同版本可能存在差异，建议使用同一版本，便于查看源代码)

## 列表项目高度固定

在 rc-virtual-list 中，做了这三件事：

- 计算可见区域索引
- 设置偏移量和虚拟容器总高度
- 只渲染 visible + buffer 的数据项

对**列表项高度固定**的情况，根据滚动条位置，它能很容易计算到需要显示的列表项的索引范围。

我们查看相关源代码：

1、从 /lib/index.js 打开工具包，看到实际引用的工具：

```js
var _List = _interopRequireDefault(require("./List"));
var _default = (exports.default = _List.default);
```

2、查看 List 代码，会看到 .d.ts 中参数定义：

```ts
export interface ListProps<T>
  extends Omit<React.HTMLAttributes<any>, "children"> {
  // ... 其他代码
  height?: number;
  itemHeight?: number;
  // ... 其他代码
}
```

我们关注 `height` 和 `itemHeight` 这两个参数。

如果读者有使用经验，就知道 itemHeight 就是我们的列表项高度。

3、我们继续查看 List.js 代码：

有 500 多行，好在我们现在可以通过 itemHeight 参数快速了解代码流程，所以我们可以直接检索 itemHeight 的相关用法即可。

- 这里列出找到的关键代码 1 —— 虚拟滚动的开关：

```js
var useVirtual = !!(virtual !== false && height && itemHeight);
```

其中 virtual 参数我们不传递，就是 undefined ，默认是开启的。height 和 itemHeight 是开启虚拟滚动的必要参数。

- 然后是相关变量的使用，这里给出关键代码 2 —— 计算显示的数据的区间：

```js
var _React$useMemo = React.useMemo(function () {
      // ... 其他代码
      var itemTop = 0;
      var startIndex;
      var startOffset;
      var endIndex;
      var dataLen = mergedData.length;
      for (var i = 0; i < dataLen; i += 1) {
        var _item = mergedData[i];
        var key = getKey(_item);
        var cacheHeight = heights.get(key);
        var currentItemBottom = itemTop + (cacheHeight === undefined ? itemHeight : cacheHeight);

        // Check item top in the range
        if (currentItemBottom >= offsetTop && startIndex === undefined) {
          startIndex = i;
          startOffset = itemTop;
        }

        // Check item bottom in the range. We will render additional one item for motion usage
        if (currentItemBottom > offsetTop + height && endIndex === undefined) {
          endIndex = i;
        }
        itemTop = currentItemBottom;
      }
      // ... 其他代码
      return {
        scrollHeight: itemTop,
        start: startIndex,
        end: endIndex,
        offset: startOffset
      };
    }, [inVirtual, useVirtual, offsetTop, mergedData, heightUpdatedMark, height]),
```

显然，这里有个关键的触发逻辑：当滚动条高度变化的时候，重新计算需要显示的列表项的范围。

- 最后是对获取到的变量的渲染，这里是关键代码 3 —— 渲染：

```js
(scrollHeight = _React$useMemo.scrollHeight),
  (start = _React$useMemo.start),
  (end = _React$useMemo.end),
  (fillerOffset = _React$useMemo.offset);
// ================================ Render ================================
var listChildren = (0, _useChildren.default)(
  mergedData,
  start,
  end,
  scrollWidth,
  offsetLeft,
  setInstanceRef,
  children,
  sharedConfig
);
```

了解这三段代码就能知道 rc-virtual-list 整体设计了，然后可以进一步阅读源代码。

## 列表项目高度不固定

对于不确定的高度的情况，仍然需要传递 itemHeight 参数，用于开启虚拟渲染。itemHeight 还有一个作用，作为初始化渲染时估算的高度。

```js
var useVirtual = !!(virtual !== false && height && itemHeight);
```

我们查看源代码 .d.ts 中 List 的参数，并没有看到“标记是否是等高列表项”的参数。

所以 rc-virtual-list 并没有专门区分列表项是等高还是不等高，而是统一通过一套逻辑来处理。

于是，很容易想到，对于不确定的高度的情况，还有额外的逻辑处理。

从上面的“关键代码 2”中，我们关注这两句：

```js
var cacheHeight = heights.get(key);
var currentItemBottom =
  itemTop + (cacheHeight === undefined ? itemHeight : cacheHeight);
```

可以看到，比 itemHeight 优先级更高的是 cacheHeight ，显然这是最终的列表项的高度。

我们可以在 List.js 中查找 heights 这个变量相关代码，就能找到对于不等高列表项的处理逻辑。

关键代码 4 —— 列表项最终高度的计算：

```js
// ================================ Height ================================
var _useHeights = (0, _useHeights3.default)(getKey, null, null),
  _useHeights2 = (0, _slicedToArray2.default)(_useHeights, 4),
  setInstanceRef = _useHeights2[0],
  collectHeight = _useHeights2[1],
  heights = _useHeights2[2],
  heightUpdatedMark = _useHeights2[3];
```

进一步查看 \_useHeights3 和 \_slicedToArray2 的定义。

```js
var _slicedToArray2 = _interopRequireDefault(
  require("@babel/runtime/helpers/slicedToArray")
);
var _useHeights3 = _interopRequireDefault(require("./hooks/useHeights"));
```

查阅网上资料：

> \_slicedToArray 是一个帮助函数，用于将一个可迭代对象（比如数组或类数组对象）转化为一个数组，并且允许你通过解构赋值的方式获取其中的元素。

显然，关键代码在 useHeights.js 文件中，它负责动态记录并更新每个列表项的实际高度。

关键代码 5 —— 缓存高度的更新方式：

```js
// ... 其他代码
var instanceRef = (0, _react.useRef)(new Map());
var heightsRef = (0, _react.useRef)(new _CacheMap.default());
// ... 其他代码
function collectHeight() {
  var sync =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  cancelRaf();
  var doCollect = function doCollect() {
    var changed = false;
    instanceRef.current.forEach(function (element, key) {
      if (element && element.offsetParent) {
        var offsetHeight = element.offsetHeight;
        var _getComputedStyle = getComputedStyle(element),
          marginTop = _getComputedStyle.marginTop,
          marginBottom = _getComputedStyle.marginBottom;
        var marginTopNum = parseNumber(marginTop);
        var marginBottomNum = parseNumber(marginBottom);
        var totalHeight = offsetHeight + marginTopNum + marginBottomNum;
        if (heightsRef.current.get(key) !== totalHeight) {
          heightsRef.current.set(key, totalHeight);
          changed = true;
        }
      }
    });

    // Always trigger update mark to tell parent that should re-calculate heights when resized
    if (changed) {
      setUpdatedMark(function (c) {
        return c + 1;
      });
    }
  };
  if (sync) {
    doCollect();
  } else {
    promiseIdRef.current += 1;
    var id = promiseIdRef.current;
    Promise.resolve().then(function () {
      if (id === promiseIdRef.current) {
        doCollect();
      }
    });
  }
}
// ... 其他代码
```

到这里，逻辑就很明确了：（朴实无华的操作）获取列表项元素的高度，然后缓存起来。

## 小结

我们查阅了 rc-virtual-list 源代码，根据 itemHeight 参数一路追踪相关代码逻辑，最终梳理得到了它的实现原理：

- 1、初始化计算可见区域
  根据传入的 height（容器高度）与 itemHeight（预估项高）计算出可视区域最多可展示多少项（visible count），并结合缓冲区（buffer）确定初始渲染范围。

- 2、设置容器偏移与占位高度
  通过 transform: translateY(...) 设置可见项的起始偏移位置，通过一个填充元素 (Filler) 设置虚拟列表总高度，确保滚动条正常。

- 3、监听滚动事件，实时计算渲染范围
  滚动时，根据 scrollTop 和（预估或真实）高度缓存，遍历计算可视区域的起始和结束索引，更新渲染项。

- 4、收集并缓存真实 DOM 高度
  利用 useHeights 钩子，监听每个 item 的 DOM 元素变化（包括高度和 margin），并缓存其实际高度，如果高度发生变化会触发重新计算。

- 5、动态同步滚动偏移，修正误差
  如果发现首项真实高度与 itemHeight 不一致，会在下一帧中自动调整 scrollTop，防止滚动跳动或错位。

- 6、默认开启虚拟滚动模式
  除非手动设置 virtual={false}，只要设置了 height 与 itemHeight，就会默认启用虚拟渲染逻辑。

其中，1、3、4 步骤就是我们主要追踪的源码的逻辑。

# 编码实现 demo

参考了别人的代码，我们可以自己尝试编写代码了。（不是 cv 不是 cv 不是 cv）

这是一份基于 **原生 JavaScript 和 DOM 操作** 实现的「虚拟列表」示例，支持 **不等高列表项** 和 **平滑滚动体验**，整体思路参考了 `rc-virtual-list` 的核心设计。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Virtual List - Smooth Scrolling with Better Buffer</title>
    <style>
      #container {
        height: 400px;
        overflow-y: auto;
        border: 1px solid #ccc;
        position: relative;
      }

      .item {
        box-sizing: border-box;
        padding: 10px;
        margin: 4px 0;
        background: #f9f9f9;
        border: 1px solid #ddd;
        position: absolute;
        width: calc(100% - 8px);
        left: 4px;
      }

      #spacer {
        position: absolute;
        width: 100%;
        left: 0;
        top: 0;
        z-index: -1;
      }
    </style>
  </head>

  <body>
    <div id="container">
      <div id="spacer"></div>
      <div id="list"></div>
    </div>

    <script>
      // 总数据量
      const TOTAL = 10000;

      // 估算每项平均高度（未测量前使用）
      const ESTIMATED_HEIGHT = 50;

      // 向上向下缓冲渲染多少个额外元素（增加缓冲区以提高平滑度）
      const BUFFER = 15;

      // DOM 元素引用
      const container = document.getElementById("container");
      const list = document.getElementById("list");
      const spacer = document.getElementById("spacer");

      // 模拟不等高数据
      const data = Array.from({ length: TOTAL }, (_, i) => ({
        id: i,
        text: `Item ${i} - 这是一个测试项目，内容长度不同以模拟真实场景`,
        height: 30 + Math.floor(Math.random() * 50), // 高度 30~80 之间
      }));

      // 高度缓存（id => height）
      const heights = new Map();

      // 每一项的偏移位置（计算 top）
      const positions = [];

      // 当前渲染的元素范围
      let currentRange = { start: 0, end: 0 };

      // 已渲染的DOM元素缓存
      const renderedElements = new Map();

      // 计算所有项的 top 偏移位置
      function calcPositions() {
        positions.length = 0;
        let top = 0;
        for (let i = 0; i < data.length; i++) {
          const h = heights.get(i) || ESTIMATED_HEIGHT;
          positions.push(top);
          top += h;
        }
        spacer.style.height = top + "px"; // 设置撑高容器高度
      }

      // 使用二分查找快速定位当前 scrollTop 对应的可视起始项
      function findStartIndex(scrollTop) {
        let low = 0;
        let high = data.length - 1;
        while (low <= high) {
          const mid = Math.floor((low + high) / 2);
          const midTop = positions[mid];
          const midBottom = midTop + (heights.get(mid) || ESTIMATED_HEIGHT);
          if (midBottom <= scrollTop) {
            low = mid + 1;
          } else {
            high = mid - 1;
          }
        }
        return Math.max(0, low - BUFFER); // 加 buffer
      }

      // 创建单个列表项元素
      function createElement(index) {
        const item = data[index];
        const div = document.createElement("div");
        div.className = "item";
        div.innerText = item.text;
        div.style.height = item.height + "px";
        div.dataset.index = index;
        return div;
      }

      // 渲染可见范围内的项
      function render() {
        const scrollTop = container.scrollTop;
        const containerHeight = container.clientHeight;

        calcPositions();

        const start = findStartIndex(scrollTop);
        const visibleEnd = scrollTop + containerHeight;

        // 计算结束索引，增加更多缓冲
        let end = start;
        while (
          end < data.length &&
          positions[end] < visibleEnd + BUFFER * ESTIMATED_HEIGHT
        ) {
          end++;
        }
        end = Math.min(end + BUFFER, data.length);

        // 如果渲染范围变化不大，避免重新渲染
        if (
          Math.abs(currentRange.start - start) < BUFFER / 2 &&
          Math.abs(currentRange.end - end) < BUFFER / 2
        ) {
          return;
        }

        // 移除不再需要的元素
        const toRemove = [];
        renderedElements.forEach((element, index) => {
          if (index < start || index >= end) {
            toRemove.push(index);
            list.removeChild(element);
          }
        });
        toRemove.forEach((index) => renderedElements.delete(index));

        // 添加新需要的元素
        for (let i = start; i < end; i++) {
          if (!renderedElements.has(i)) {
            const element = createElement(i);
            element.style.transform = `translateY(${positions[i]}px)`;
            renderedElements.set(i, element);
            list.appendChild(element);
          } else {
            // 更新已存在元素的位置
            const element = renderedElements.get(i);
            element.style.transform = `translateY(${positions[i]}px)`;
          }
        }

        currentRange = { start, end };

        // 测量新添加元素的真实高度
        measureHeights(start, end);
      }

      // 获取真实 DOM 高度，更新缓存
      function measureHeights(start, end) {
        let needsRecalc = false;

        for (let i = start; i < end; i++) {
          const element = renderedElements.get(i);
          if (element) {
            const realHeight = element.offsetHeight;
            if (heights.get(i) !== realHeight) {
              heights.set(i, realHeight);
              needsRecalc = true;
            }
          }
        }

        // 如果高度有变化，重新计算位置
        if (needsRecalc) {
          calcPositions();
          // 更新所有已渲染元素的位置
          renderedElements.forEach((element, index) => {
            element.style.transform = `translateY(${positions[index]}px)`;
          });
        }
      }

      // 滚动监听
      // 滚动事件可能非常频繁触发（比如每毫秒多次）
      container.addEventListener("scroll", () => {
        // 但渲染只会在浏览器准备重绘时执行
        requestAnimationFrame(render); // 不会少于一帧的时间执行
      });

      // 窗口大小变化时重新渲染
      window.addEventListener("resize", () => {
        requestAnimationFrame(render);
      });

      // 初始渲染
      calcPositions();
      render();
    </script>
  </body>
</html>
```

直接运行上面的代码，打开开发者工具 Elements ，可以查看到这个 demo 的显示效果。

## DOM 结构

```html
<div id="container">
  <div id="spacer"></div>
  <!-- 撑起总高度，使滚动条正常显示 -->
  <div id="list"></div>
  <!-- 实际渲染的列表项区域 -->
</div>
```

- `#container` 是设置固定高度的滚动容器；
- `#spacer` 设置整个虚拟列表高度；
- `#list` 中渲染真实可见的列表项。

## 实现原理

1. **高度预估与测量**

   - 初始使用 `ESTIMATED_HEIGHT` 作为每项高度；
   - 渲染后获取真实 DOM 高度并更新缓存；
   - 每次变化后重新计算各项的偏移 `top`。

2. **可见区域渲染**

   - 使用二分查找定位当前 `scrollTop` 对应的可视起始项；
   - 加入上下 `BUFFER` 缓冲区，避免频繁增删导致的跳动；
   - 对于不可见项及时卸载 DOM，提升性能。

3. **渲染与更新**

   - 根据可见范围创建/更新 DOM 元素；
   - 使用 `transform: translateY(...)` 设置 Y 轴偏移；
   - 缓存已渲染元素，避免重复插入。

4. **性能优化**
   - 使用 `Map` 存储已渲染 DOM；
   - 使用 `requestAnimationFrame` 控制渲染频率；
   - 如果滚动范围变化不大，则跳过更新。

## 关键函数说明

| 函数名                       | 功能说明                       |
| ---------------------------- | ------------------------------ |
| `calcPositions()`            | 根据缓存高度计算每项的偏移 top |
| `findStartIndex(scrollTop)`  | 二分查找滚动位置对应的起始项   |
| `render()`                   | 控制渲染可见范围元素           |
| `measureHeights(start, end)` | 更新高度缓存并修正偏移位置     |
| `createElement(index)`       | 创建单项 DOM 节点              |

## 小结

到此为止，我们已经能够理解并实现虚拟滚动列表了。

如果你的目标是学习虚拟列表，那么到此就可以结束了。

后文会介绍浏览器的渲染机制，然后进一步讨论虚拟列表带来的收益的量化测评。

# 渲染过程

# 性能测试

# 总结

文章谬误之处欢迎指正。

# 参考资料

- [rc-virtual-list](https://www.npmjs.com/package/rc-virtual-list)
- Web 性能优化权威指南
- chatGpt
