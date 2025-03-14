---
title: JavaScript学习笔记
published: 2019-10-01
description: ""
image: ""
tags: ["js"]
category: "前端入门"
draft: false
---

# 零散笔记

**web 前端三层**：（w3c 规范）
结构层 HTML 从语义的角度，描述页面结构。
样式层 CSS 从审美的角度，美化页面。
行为层 JavaScript 从交互的角度，提升用户体验。

加入 script 属性后，网页会产生弹窗。

## script 属性

**alter("");**
显示警告弹窗信息，双引号内信息即为弹窗内信息。
如果页面上出现弹框，此时页面位置不能改变，并且不能关闭，进程被阻塞。

**type=**"text/javascript"
可以省略。

**sync=**"sync"
同步：理解为单线程

**async=**"async"
异步：理解为多线程
立即异步下载外部 js ，不影响其他页面操作，js 下载完毕立即执行。

**defer=**"defer"
异步：区别于 async
脚本延迟到文档完全被解析和显示后再执行；
只有外部脚本可以使用。

**console.log("");**
在浏览器控制台中输出一句话。
作用：进行代码的调试。

**prompt("");**
在页面上弹出一个提示输入框，提示信息为双引号间内容。

## JavaScript 语法

** 变量申明与赋值**
JavaScript 是弱类型脚本语言。
var a = "123";
var b = 123;
变量的类型由内部的数据的类型决定。

**变量规则与规范**
规则： 1.由字母、数字、下划线、$组成 2.不能是关键字和保留字 3.区分大小写
规范：
驼峰命名法，第一个单词首字母小写，之后单词首字母大写。

**数据类型**

string
注意，字符串的不可变性。
var str = "one"
var str = str + "two"
//第二句会分配一个新的栈空间

number
数值范围：
最小值：Number.MIN_VALUE 5e-324
最大值：Number.MAX_VALUE
1.7976931348623157e+308
无穷大：infinity
无穷小：-infinity

boolean
取值范围：
true and false

undefined，变量声明但未赋值

null

**数值检测**
Number.NaN 是一个特殊值，说明某些算术运算（如求负数的平方根）的结果不是数字。
函数 isNan() 返回值 boolean 。

**类型转换**
转换成字符串方法：

1. 函数 toString()
2. 函数 String
3. 字符串拼接：string + number 得到 string 类型

转换成数字：

1. 函数 Number()
2. 函数 parseInt()
3. 函数 parseFloat()

**表达式**
由数据、变量、运算符组成。

**运算符**

1. 赋值运算符
2. 算数运算符
3.

**转义符**
右斜杠
换行 \n

**函数**
实例：
function function_name(parmeter1,parameter2){
var variable = parmeter1 + parameter2
return variable
}
注意：没有 return 时，默认返回 undefined。

**对象**
封装、继承、多态
定义：
var object_name = {
name:"Tim",
age: 18,
height: 180
};
属性用键值对表示。

## 动态交互

**按钮**：input 或者 button 标签
**点击事件**：onclick
**获取用户输入**：prompt()
**内容检测**：if..else
**提示操作**：alert()

## JavaScript 补充

```html
<input type="button" value="变" id="btn" />
//创建一个按钮
<script type="text/javascript">
  var btn = document.getElementById("btn");
  //获取id
  btn.onclick = function () {
    alert("点击时弹出此框！");
  };
  //点击按钮时触发此框
</script>
```

**单行注释**
用双斜杠表示
添加或删除注释的快捷键一般为 Ctrl+/
**多行注释**
/\*\*/ 中间包含注释内容

## 浏览器工作模式

很有深度的文章，不求一次看懂。
（链接失效）

## JavaScript 存放位置

如果没有 style，代码放在 title 标签下，反之，放在 style 下。
