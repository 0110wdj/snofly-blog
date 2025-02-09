---
title: 机器学习入门实践
published: 2025-01-31
description: ""
image: ""
tags: ["NLP"]
category: "ML"
draft: true
---

# 0 前言

本文是一个**机器学习**(Machine Learning, ML)的应用实践，适合初级编码水平的读者。

本文选择的机器学习的细分领域是**基于统计的自然语言处理**(Natural Language Processing, NLP)，具体来说，是基于朴素贝叶斯算法训练的一个二分类器模型，用于检测收到的邮件内容并判断是否为垃圾邮件。

阅读完成之后，应该达到的目标:

- 1 理解**朴素贝叶斯算法**原理
- 2 了解**基于统计的自然语言处理**的原理
- 3 理解**机器学习模型**的原理
- 4 成功完成训练**机器学习模型**的实践
- 5 理解并运用**模型评价指标**

# 1 必须掌握的理论

## 1.1 贝叶斯定理

贝叶斯定理的数学表达式如下：

$$
P(A \mid B) = \frac{P(B \mid A) P(A)}{P(B)}
$$

其中：

- \( P(A \mid B) \) 表示在事件 \( B \) 发生的条件下，事件 \( A \) 发生的概率（后验概率）。
- \( P(B \mid A) \) 表示在事件 \( A \) 发生的条件下，事件 \( B \) 发生的概率（似然）。
- \( P(A) \) 是事件 \( A \) 的先验概率。
- \( P(B) \) 是事件 \( B \) 的全概率。

## 1.2 定理的应用

如果我们得到 \( P(A \mid B) \) ，那么就能根据现有的条件(B 发生了)去预测或判断未知的情况(A 发生的概率)。

举例 1，\( P(“I'm\ fine.” \mid “How\ are\ you\ ?”) \) ，根据经验，这两句话先后出现概率挺高的，其值假设为的 0.8 , 那么可以这样表述：当一个人对你说 “How are you ?” 时，你有 80% 的概率会回复他 “I′m fine.”

举例 2,\( P(“垃圾邮件” \mid “期待您的光临，电话号码：153xxxx1234”) \) = 0.7

举例 3,\( P(“垃圾邮件” \mid “我有朋友在那里工作。这个是个个人信箱亚，难道骗简历？”) \) = 0.01

最后的机器学习模型可以认为是一个函数，输入是一个字符串 B，输出是 P(A|B) 的值，用来表示输入的字符串是垃圾邮件的概率。

## 1.3 朴素贝叶斯

朴素贝叶斯是贝叶斯定理的一个**特例**，它简化了问题的假设前提，从而简化了问题的解决过程。

这里简化的假设前提是：假设特征之间是条件独立的，这就是为什么叫“朴素”的原因。

这里的特征是指：事件 B 可能是由多个变量组成的一个集合，称为特征集。这个集合的元素，即是影响最终结果的变量，也称为特征。

比如，在垃圾邮件分类中，"中奖" 和 "点击链接" 这两个词可能分别增加邮件是垃圾邮件的概率，而不会相互影响。

