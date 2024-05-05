---
title: Webpack 入门
published: 2023-11-04
description: ""
image: "./logo.png"
tags: ["webpack"]
category: "入门"
draft: false
---

# 前言

## 作者述

随着技术的发展，新的工具不断出现，老的工具依然不过时。说到底，设计思想并没有革命性的变化。而工具，够用就行了。

本文通过 Webpack 来聊聊打包上的一些事情，结合实例来看看 Webpack 的使用和优化，最后做到能够按需自定义配置。

在[官网](https://www.Webpackjs.com/)有完整的说明，强烈建议之后去看一下。

## 预备知识

- 前端基础知识
- 了解项目部署基本知识
- 了解 npm 使用

本文适合有一定使用经验的读者 —— 能够创建一个简单的 app, 完成简单的模块代码开发。

## 本文目标

提高整体理解，对“打包”这件事和“打包工具 Webpack” 的认识。

- 了解到 Webpack 的历史发展
- 使用基本配置完成打包
- 了解常用的配置项及其含义
- 常用的配置项

最主要的是，在实际项目中用到 Webpack 时，能够用更高的视角来看待问题。

# 历史发展

## 基本概念

先介绍下三个概念的区别：

- 打包

  - **打包**是一个动作，是指处理某些⽂件并将其输出为其他⽂件的过程。

- 模块打包工具(module bundler)

  - **模块打包工具** 帮助生成用于部署的 js 脚本和样式表，可以通过配置提高代码性能和浏览器兼容性。

- 任务执行工具(task runner)

  - **任务执行工具** 用来自动化处理常见的开发任务，例如，lint(代码检测)、build(构建)、test(测试)。

相比模块打包工具（例如：Webpack、Browserify、Brunch），任务执行工具（例如：Make、Grunt、Gulp ）则聚焦在偏重上层的问题上面。

## 打包过程与模块开发

这个过程，随着时间的发展，不断出现新的问题和解决方案。

### 手动处理

> 在浏览器中运⾏ JavaScript 有两种⽅法。第⼀种⽅式，引⽤⼀些脚本来存放每个功能；此解决⽅案很难扩展，因为加载太多脚本会导致⽹络瓶颈。第⼆种⽅式，使⽤⼀个包含所有项⽬代码的⼤型 .js ⽂件，但是这会导致作⽤域、⽂件⼤⼩、可读性和可维护性⽅⾯的问题。

那时候还是 var 定义变量，在项目逐渐复杂之后，一系列问题凸显出来。

### 作用域冲突

为了解决作用域冲突问题，用立即执行函数 (IIFE - Immediately invoked
function expressions) 来封装单个函数功能。

这个做法虽然不是很好看，但确实很有用。当然，现在基本不这么写了。

```js
// foo.js
((param) => {
  var onlyThisFun = 0;
  console.log({ param });
  // other handle
  return "result";
})(param);
```

用 IIFE 的方法成功避免了作用域冲突，但是代码在 \<script \/\> 中的加载仍然复杂且存在冗余代码。

### 精简引入

CommonJS 问世并引⼊了 require 机制，它允许你在当前⽂件中加载和使⽤某个模块。而 Node.js 中很好的实现了这一点。

npm + Node.js + modules 的方式几乎和现在的写法一致了。

```js
// bar.js
module.exports = () => {
  // ...
};
```

```js
const bar = require('./bar.js')

bar()

exports.foo = 'foo'

exports.fn = () => { ... }
```

可以只引入库中需要的函数，减少了非必要代码。

当然，这里有个关键的问题：CommonJS 在 Node.js 中被原生支持，而浏览器原生是不支持 CommonJS 的。

### ECMA 模块

来⾃ Web 项⽬的好消息是，模块正在成为 ECMAScript 标准的官⽅功能，浏览器正在逐步⽀持中。

```js
// NumCalc.js
const addCalc = (a, b) => a + b;
const delCac = (a, b) => a - b;
export { addCalc, delCac };
```

```js
// index.js
import { addCalc, delCac } from "NumCalc";
console.log(addCalc(1, 2));
console.log(delCac(1, 2));
```

这种写法就很现代化了。

但是，ECMAScript 规范只是规定了最基本的事情需要怎么做，这里还有很多值得优化的地方。

例如：

```js
// index.js
import { addCalc, delCac } from "NumCalc";
setTimeOut(() => {
  console.log(addCalc(1, 2)); // 1、提前很久引入很久以后才执行、甚至可能不执行的代码
}, 200000);
// console.log(delCac(1, 2)) // 2、引入不用的代码
// 3、图片等资源怎么处理
// 4、代码的浏览器兼容问题
// 5、import export 太多，眼睛疼，怎么提高开发效率
```

你可能会说我在吹毛求疵，眼睛疼关 Webpack 什么事？

我想说，Webpack 经过这么多年的发展，已经是很完善且稳定的打包工具了。它就是考虑到了各种情况 —— 虽然这样可能会让人觉得配置起来好麻烦。

如果开发者就用默认配置，当然也能完成开发工作，只是不能得心应手的话难免会有些许遗憾。

## Webpack 发展史

此时从 Webpack github 上看到，最新的 release 版本是 v5.89.0 ，Webpack-cli 的版本是 v5.1.4 。

本文不关注版本的差别（一般都用新版本），只是稍稍了解一下 Webpack 是怎么出现的。

### 创作者

从 github 的 Webpack 上可以看到核心团队的信息。

![core team](./coreTeam.png)

其中，第一位，Tobias Koppers 就是这个仓库创建者，也就是最早的创作者。

Tobias 是一个德国人，网络昵称叫 sokra 。

sokra 之前是 Java 开发者。在 Java 里面有个很出名的技术 GWT（Google Web Toolkit）。GWT 里面有个 feature 叫「code splitting」。

2012 年 2 月 24 号，sokra 给 modules-webmake（前端项目打包的库）提了一个 issue ，希望他们能实现这个 feature。但是 modules-webmake 的维护者一直没有实现这个功能。

2012 年 3 月 10 号，sokra 去 follow 了一份 modules-webmake 代码，在 github 上开了一个新的项目 Webpack 。

「code splitting」这个 feature 就是 Webpack 现在提供的主要功能，也是当代前端的基石。

Webpack 的设计思想并不是独创的，但在当时的前端模块打包工具，它是最先进的 —— 特别是性能优化和热更新。

### 影响力扩大

2013 年，React 开源。

2014 OSCON 大会（OSCON 是动物书 O'Reilly 组织的），Instagram （React 开发的图片社交网站） 的前端团队分享了他们对前端页面加载性能优化，其中很重要的一件就是用到的 Webpack 的 featere「code splitting」。

当时引起了很大的轰动，之后大家纷纷使用 Webpack，并给 Webpack 贡献了无数的 plugins ，loader。

2014 年后 Webpack 发展非常迅猛，版本更新非常快。

至今，Webpack 仍是主流之一。

# 示例讲解

## 专业术语

拉高视角 up up up ~~

---

在项目开发过程中，我们经常会用到很多工具，webpack 只是好用的工具之一。

实际项目中使用 webpack 时，常提到一些名词或操作：代理、打包、热更新、开发环境、生产环境、依赖等。

还有一些不常提及（因为不怎么修改）但一直使用的概念：打包入口、loader、输出目录、插件、懒加载等。

后文会结合配置文件内容解读来说明一下这些术语，现在不理解也没关系。

这里提出来是为了说明一下本文的**核心思想**，也就是前文这句：**_“这个过程，随着时间的发展，不断出现新的问题和解决方案。”_**。

上面这些既是术语概念也是解决方案，为了相继出现的问题而存在。

## 快速开始

webpack 以 npm 包的形式存在，所以像正常使用一个 npm 包一样就行了。

比如在一个简单的 npm 管理的项目中安装 webpack :

```
npm install webpack webpack-cli --save-dev
```

然后使用它：

```
npx webpack
```

ok, 完成，结束，你已经会了。🤪

虽然但是，到这一步，只使用默认配置，确实可以完成项目的 build 了。

对于前端初级工程师来说，一般是做项目模块的业务代码开发，是不会去做项目结构上的配置和优化的。比如项目技术栈选型、目录结构设置、项目流程优化（其中构建部分如果选用 webpack 工具，那么也涉及到 webpack 配置优化）等等，都是更有经验的高级工程师来做的。

本文到这里，后面的内容是从官网选了一部分，结合我的个人理解总结的。如果读者时间充裕的话，建议直接去官网阅读。

## 配置文件

和大多数工具一样，传递配置信息的入口无外乎两种：命令行参数、配置文件。

webpack 首先获取并合并命令行参数和配置文件内的参数。

为了便于管理，webpack 不使用全局安装，一个项目用一个专属的 webpack 配置文件。

---

我们先来看看最基本的配置都有什么。

```js
// {项目根目录}/webpack.config.js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
};
```

一个程序最基本的当然是输入和输出啦，webpack 也一样。

其中 entry 是打包的入口，也就是主程序的入口。对于现在常用的**单页应用程序（SPA: Single Page Application）** 来说，通常只有一个 entry 入口文件。

而 output 就是打包结果输出的地方，一般都放在主目录的 dist 文件夹下面。

诶？有没有发现什么问题？

1、这个配置文件为什么是用 CommonJS 的模块写法？很多项目里也是这样的写法。
2、我们开发的时候不是 npm start 就能跑程序了吗？和 dist 文件夹有什么关系？

下面先回答一下这两个问题。

### 配置文件写法问题

先说结论：这个问题不重要，现在新版 webpack 对两种写法都是支持的了。

第一个原因是：webpack 在 es6（ECMAScript 6 约等于 JavaScript 2015，也就是 2015 年发布的）之前出现，所以一开始就是这么写的，后来就习惯了懒得改。

第二个原因是：webpack 在 node.js 环境中运行，而 node.js 就是实现的 CommonJs ，运行没问题没必要改。

### 热更新和 dist 文件问题

> 热更新：热更新通常用于实时预览代码更改的效果，无需手动刷新浏览器。这种机制可以加速开发过程，提高开发效率。

npm start 其实也会生成类似 dist 的文件，只是这个文件不像放在项目根目录的 dist 文件那样静态、精简和具体。

开发的时候关注点在代码更新上，也就是热更新和错误定位，这需要很快的读写速度。

npm start 启动的开发服务器在内存中运行，当进行代码更改并保存时，热更新机制会检测到这些更改，并实时更新正在运行的应用程序，相关页面自动刷新。

用热更新的方式去检测打包输出的 dist 文件，也可以做到不用重启 app 就更新模块的效果。但是一般不这么做（除非想观察和调整资源路径，比如图片放哪里比较好这种问题），因为磁盘读写比内存读写要慢。

因为关注点不同，这里就有两个概念：开发环境和生产环境，也是两种工作模式，需要相应的配置。

### 开发环境和生产环境

我们基于在上面的配置，添加一行配置，如下所示：

```js
// {项目根目录}/webpack.config.js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "development", // 或者 mode: 'production',
};
```

这个 mode 有两个取值：development 或 production。用于指明当前 webpack 的一系列默认操作，可以简单而好用的帮助开发者应对不同场景。

还是之前一样，很多默认配置不关注也足够使用。也可以人为地控制各种细节功能应该怎么处理。

> 题外话：
>
> 在一个空白目录中执行 npm init，会生成 package.json 文件。
>
> 为了防止不必要的资源打包入最后的代码，依赖项也分为开发环境依赖和生产环境依赖。
>
> ```js
>
> {
>   // ......
>   "devDependencies": { // 开发环境依赖项
>     "webpack": "^5.88.2",
>     "webpack-cli": "^5.1.4"
>   },
>   "dependencies": { // 生产环境依赖项
>     "lodash": "^4.17.21"
>   }
> }
> ```
>
> 仅用于开发的工具资源就放在 devDependencies 就行，生产环境中需要用到的工具资源就放在 dependencies 里面。这样也能优化打包过程，较少打包工具的负担。
>
> 添加包时，用参数指明添加到哪个下面：
>
> ```bash
> npm install --save-dev webpack-merge // 开发
> npm install --save lodash // 生产
> ```

更多配置，详见官网。

## 回答问题

之前有五个问题：

- 1、提前很久引入很久以后才执行、甚至可能不执行的代码
- 2、引入不用的代码
- 3、图片等资源怎么处理
- 4、代码的浏览器兼容问题
- 5、import export 太多，眼睛疼，怎么提高开发效率

根据实际项目经验，这里在补充两个：

- 6、开发环境时 api 请求的主机地址不在本机，怎么处理？

<!-- 代理、loader、插件。 -->

### 懒加载

_问题：1、提前很久引入很久以后才执行、甚至可能不执行的代码_

有时候下载了资源，但是全程没有使用，那么这时候所占用的下载时间和网络资源就浪费了，特别是资源本身很大的时候。

举个栗子 🌰：有一种情况，就是有个按钮的事件非常复杂，相应的 script 代码就很多，但是我们实际使用的时候只有很小的概率去点击它。

再举个栗子 🌰：一个网页的后半部分有很多不小的图片，但是用户可能根本不往后翻就切换了，这个时候仍然下载图片的话，也是一种浪费。

解决办法就是懒加载，达到某个条件才去加载相关资源，而不是一开始就去下载。

```js
import _ from "lodash";

function component() {
  const button = document.createElement("button");

  button.innerHTML = "import while click";

  button.onclick = (e) =>
    import("./print").then((module) => {
      const print = module.default;
      print();
    });

  return element;
}

document.body.appendChild(component());
```

懒加载的特点就是，只在需要的时刻（或提前一点点）去获取资源。这会下降少数时候的一些用户体验，但是能提升多数时候的用户体验。

> 在 4G 基建完成、网速大幅度提升之后，懒加载仍然是优化用户体验不可或缺的手段之一。
>
> 在短视频 app 中，为了兼顾流畅的用户体验和减少网络负担，在用户查看第一个视频时，app 就开始加载下几个视频的前几秒钟的内容，当用户切换到某个视频时，再下载该视频的后续内容。这样用户体验上完全没有卡顿，但是也不会花占用太多网络资源。

### tree shaking

_问题：2、引入不用的代码_

比如：

```js
import { foo } from "foo.js";
import { bar } from "bar.js";
const res = foo();
console.log({ res });
```

这里没有使用 bar 函数，看起来最好的解决办法就是修改代码，不引入 bar 就行了。

但是注意这里是有坑的。

如果 bar.js 中有副作用，那么还需要更多的考虑。比如这么写：

```js
// bar.js
window.isBarLoaded = true;
window.isBarCalled = false;

bar = () => {
  window.isBarCalled = true;
  console.log("did something");
};

export { bar };
```

其实这个时候，webpack 不能很容易的判断是否应该忽略 bar.js 这个文件，从而减少打包输出的文件体积。

当然，在 webpack 也中有相关的机制去处理，但是更需要手动配置。

```js
{
  "name": "your-project",
  "sideEffects": ["./src/some-side-effectful-file.js"]
}
```

tree shaking 是一个术语，通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code)。webpack 通过 sideEffects 来标记存在副作用的文件，然后他就能轻松地 tree shaking 了。

### loader

_3、图片等资源怎么处理_

比如图片、字体这些静态资源，只要指明路径就可以加载了。但是 less、scss、ts 这种资源是需要翻译一下的，浏览器只支持他们翻译过来的 css、js 文件。

这个时候明显就需要打包之前执行某些翻译程序了。

回顾一下， webpack 是模块打包工具的一种。它处理以模块为单位的资源，这里的翻译程序就是将各种资源转化为 webpack 可以处理的模块的加载器 —— loader。

关于 loader 的配置，在 module.rules 中配置。

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
};
```

这里的 type: "asset/resource" 表示图片资源会被作为模块类型进行处理，最终会生成一个资源模块。在 dist 中可以看到文件名被改为 uuid 保证唯一性的图片资源。

对于 less 这种非标准的文件，需要专门的工具(例如 less-loader)去转化为 css 文件，然后再有 css-loader 解析 CSS 中的 @import 和 url() 等引用。最后，style-loader 将 CSS 样式通过 JS 模块的形式嵌入到 HTML 文档中。

得到模块之后，就是 webpack 的主场了。

_4、代码的浏览器兼容问题_

正如之前 less 翻译为 css 一样，es6 代码也可以用 hack 的写法翻译为 es5 代码。

我们常在项目中看到的 babel-loader 就是调用了 babel 工具来做翻译的事情。

```js
module: {
  rules: [
    {
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
        },
      },
    },
  ];
}
```

### Plugin (插件)

_5、import export 太多，眼睛疼，怎么提高开发效率_

~~地点眼药水吧~~ 合理使用插件。

插件是扩展 webpack 功能的工具，它们并不直接操作文件，而是基于事件机制工作，监听 webpack 打包过程中的某些节点，执行广泛的任务。

这个非常广泛和庞杂，等用到了自行查询即可。也可以看看推荐较多的 webpack 插件。

### 代理 proxy

_6、开发环境时 api 请求的主机地址不在本机，怎么处理？_

使用 js 调用 API 时，我们一般用 http 访问。

如果前后端部署在同一个服务器上，那么自然使用 http://loacalhost:port/urlPath 来访问。

我们在代码中一般这么写访问路径，fetch('/api/urlPath'),这段代码由 webpack 先转换一下。

```js
module.exports = {
  //...
  devServer: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
};
```

然后由 http-proxy-middleware 提供的代理功能，请求先到本地前端开发服务器，再转到后端，这样就能解决前端直接访问后端 API 的跨域问题。

> 理解一下，前端开发时，往往前端程序在本地运行，而后端是已经部署的服务。那么前端直接访问外部资源的话，浏览器从安全因素考虑直接拒绝了。这个时候，本地有个受信任的服务器，就能让前端的请求交给该服务器帮忙处理发送和接受数据。
>
> 前端程序和后端程序一般部署在同一个机器上，自然没有问题。

# 总结

以上是笔者整理的 webpack 相关内容，希望能帮到你，不至于毫无头绪。

我们回顾一下目标，感受一下。

- 了解到 Webpack 的历史发展
- 使用基本配置完成打包
- 了解常用的配置项及其含义
- 常用的配置项

文章谬误之处欢迎指正。

# 参考资料

- [Webpack 官方文档](https://www.Webpackjs.com/guides/integrations/)

- [Webpack 诞生记](https://zhuanlan.zhihu.com/p/71640308)

- [webpack proxy 使用（代理的使用）](https://juejin.cn/post/6844904042246881293)
