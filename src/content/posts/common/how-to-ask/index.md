---
title: "社区提问注意事项"
published: 2024-06-01
description: ""
image: ""
tags: ["翻译"]
category: "闲话杂谈"
draft: false
---

# 前言

## 译者述

在技术领域，常用的检索信息的方式有（按照笔者的使用频率排序）：

- 搜索引擎
- AI 问答
- 社区提问
- 查阅文献

多模态的 ai 对话模型真的令人惊艳，而传统搜索引擎则显得呆板和不智能。

值得注意的是，这两种工具的侧重点是不同的。

搜索引擎的优势在于关键字的检索，往往一两个词语，就能得到用户想要的结果。

ai 模型的优势在于，对完善的 prompt 能有非常出色的解答。

社区提问存在延迟性，可能过很长时间也没有回答。而且，往往到不了这一步，就可以在前两步得到答案。

查阅文献的时候，只有在大概知道答案在什么地方，才能有一点点效率，否则就是大海捞针。好消息是，知识是有来源的，我们总能找到问题的出处。

**关于下文**

1、原文来自 [Amber](https://stackoverflow.com/users/148870/amber) 个人网站上的一篇文章：[How to Ask for Programming Help](https://codingkilledthecat.wordpress.com/2012/06/26/how-to-ask-for-programming-help/)。

2、这是一篇针对社区提问的一些建议, 发布于 2012 年 6 月 26 日。

3、翻译中会尽量遵照原意, 也会加入译者的技术注释, 以及选择更符合汉语文法的译句。

4、欢迎指正，非常感谢。

---

# 译文

先声明一下，在编程问题中我[乐于助人](http://stackoverflow.com/users/148870/amber)。当别人学习编程时，如果能给予他们帮助，我会觉得很有趣、很开心。这个过程中，提供帮助的难易程度会受到多方面因素的影响。这里有一些建议可以帮助你提高问题的质量和你得到帮助的效率。

## 先自己尝试解决

简单来说，如果你在寻求帮助，你应该是"寻求帮助"，而不是"获得解决方案"。大多数人都乐意提供帮助建议，但是不会为你的工作或爱好负责。如果你有一个问题，先试试看你自己能做什么。如果你完全不会也没有关系，至少可以帮助你的上司给你安排工作时排除某些不适合的内容。

如果你遇到的问题有文档或手册，从那里去寻找答案。即使最后没有找到，你也能够找到很多其他问题的答案。

如果你的问题已经存在解决方案了，谷歌搜索、FAQs 等都可以提供帮助。

## 缩小问题范围

一旦你对这个问题有了一些思路，试着缩小你需要帮助的范围。一个路人可能不会想要遍历你的数千行代码来找出遇到的问题。如果可能的话，尝试创建问题的简要版本，只用最少的代码来显示遇到的问题(参见:[SSCCE](http://sscce.org/))。

## 提供足够的细节

例如，当你在询问解决 error 时，一定要包含错误信息的关键文本——最好直接从包含它的日志、控制台或网页中复制粘贴。通常，错误消息中的一个小**细节**可能是帮助其他人找出代码问题的关键，这样他们就可以指出如何修复它。

如果你是在请求对特定代码段的帮助，请务必提供**代码示例**。试图在没有真正看到代码的情况下回答有关代码的问题是很困难的。能够运行的代码可以更容易地理解所问的问题，也可以更容易地回答问题，因为答案可以在实际代码的上下文中调试出来。

类似地，当你提供代码样例时，尽量不要删除太多——理想情况下，代码样例应该能够独立运行，至少在**语义**上不应该与实际代码不同。例如，在代码中隐藏特定的敏感值是可以的，但不应该更改循环条件之类的东西。

描述所展示的代码的**上下文**通常也很有用，即使只展示了一小段代码。有的时候，你会得到一些建议，使用完全不同的方法来实现你的目标，这些方法完全绕过了最初的问题(并且通常更有效)。

## 别懒

如果你在寻求帮助，你其实是在要求别人用自己的时间来解决别人的问题。不要因为愚蠢的事情而浪费他们的时间：

- 检查你的问题是否有错别字
- 确保你发布的任何链接都有效
- 如果可以的话，尽量把内容格式化得合理而美观
- 如果你在没有内置代码共享功能的地方提问，可以使用[Pastebin.com](https://pastebin.com/)这样的服务来提供你的代码示例(并打开适当的语法高亮显示)

> （译者补充：代码分享的话，我比较常用的是 [codepen](https://codepen.io/) ）

## 有耐心

除非你为别人的时间付钱，否则他们没有义务帮助你。有很多人愿意回答问题，但他们往往不喜欢被纠缠。一旦你在某处陈述了你的问题或疑问，给它一些时间。一般来说，愿意帮助别人的人会在他们有能力的时候帮助别人。如果你在第一个地方没有得到回应，你可以在其他地方问问(但如果你在其他地方得到了回应，要有礼貌，让你问的其他地方知道——最好贴出答案)。
