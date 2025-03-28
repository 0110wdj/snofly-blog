---
title: 机器学习入门实践
published: 2025-02-19
description: ""
image: ""
tags: ["NLP"]
category: "ML"
draft: false
---

# 0 前言

本文是一个**机器学习**(Machine Learning, ML)的应用实践，适合初级编码水平的读者。

本文选择的实践内容是**基于统计的自然语言处理(Natural Language Processing, NLP)**，具体来说，是基于**朴素贝叶斯算法**训练的一个二分类器 —— 用于判断收到的邮件是否为垃圾邮件。

阅读完成之后，应该达到的目标:

- 1 理解**朴素贝叶斯算法**原理
- 2 了解**基于统计的自然语言处理**的原理
- 3 理解**机器学习模型**的原理
- 4 成功完成训练**机器学习模型**的实践
- 5 理解并运用**模型评价指标**(略)

# 1 算法原理

> 笔者：算法原理了解一下就行，不用担心现在看不懂，在后文中，会进一步结合代码理解。

## 1.1 贝叶斯定理

贝叶斯定理的数学表达式如下：

$$
P(A \mid B) = \frac{P(B \mid A) P(A)}{P(B)}
$$

其中：

- P(A|B) 表示在事件 B 发生的条件下，事件 A 发生的概率（后验概率）。
- P(B|A) 表示在事件 A 发生的条件下，事件 B 发生的概率（似然）。
- P(A) 是事件 A 的先验概率。
- P(B) 是事件 B 的全概率。

## 1.2 定理的应用

如果我们得到 P(A|B) 的值，那么就能根据一些条件来预测某些事情的发生了。

举例 1， P(“I'm fine.” | “How are you ?”) ，根据经验，这两句话先后出现概率挺高的，其值假设为的 0.8 , 那么可以这样表述：当一个人对你说 “How are you ?” 时，你有 80% 的概率会回复他 “I′m fine.”

举例 2, P(“垃圾邮件” | “期待您的光临，电话号码：153xxxx1234”) = 0.7

举例 3, P(“垃圾邮件” | “我有朋友在那里工作。这个是个个人信箱亚，难道骗简历？”) = 0.01

总之，我们将 P 看作是一个函数（也就是模型），输入是字符串 B，输出是 P(A|B) 的值。

## 1.3 朴素贝叶斯

朴素贝叶斯是贝叶斯定理的一个**特例**，它简化了问题的假设前提，从而简化问题的解决过程。

**简化的假设前提**：假设特征之间是条件独立的，不考虑特征之间的关系（这也是“朴素”的含义）。

**特征**：事件 B 可能是由多个变量组成的一个集合，称为特征集。这些变量都能够影响最终的结果，被称为特征。

# 2 基于统计的 NLP

在 NLP 领域有两个研究方法：**基于规则的方法**和**基于统计的方法**。

本文对这两种方法的优劣不作评价，当然我们选择后者。

## 2.1 常规的处理流程

标准化的操作步骤是：

- 1、数据获取
- 2、数据预处理
- 3、特征提取
- 4、模型训练
- 5、模型评估

其中，第一步的数据获取，一般是用爬虫技术爬取数据，或者购买数据。我们这里准备好了<a href="/files/nlp/data.zip" target="_blank">训练数据</a>，直接下载即可。**严郑声明，仅用于学习用途！**

第二步的数据预处理，我们的训练数据也已经做好了。我们拿到的数据就是**有标记的**数据。

第五步的模型评估，不是本文的重点，直接略过。感兴趣的读者可以查阅**准确率、召回率、F1-score** 等概念。

代码实践部分，我们只做第三步和第四步。

## 2.2 特征提取

### 2.2.1 观察数据

在 2.1 节下载训练数据 data.zip 后，解压查看内部结构，应当是这样的：

```bash
➜  data tree -L 1
.
├── normal
├── spam
├── test
└── 中文停用词表.txt

4 directories, 1 file
```

其中，normal、spam、test 三个文件夹下都有若干 txt 文件，每个 txt 文件的内容是爬取的文本信息。

normal 表示其内都是正常邮件（个人笔记、好友消息等），spam 表示其内都是垃圾邮件（广告邮件之类的），test 用于测试。

从 normal 和 spam 中各取一份文件展示一下：

<details>
  <summary>data/normal 文件 274.txt</summary>

```
Return-Path: <chi@rbl.ccert.edu.cn>
Received: from rbl.ccert.edu.cn (rbl.ccert.edu.cn [202.112.57.71])
	by sea.net.edu.cn (8.12.11/8.12.11) with ESMTP id i9G08rJt015597
	for <han@ccert.edu.cn>; Sat, 16 Oct 2004 08:08:53 +0800 (CST)
Received: from rbl.ccert.edu.cn (localhost.localdomain [127.0.0.1])
	by rbl.ccert.edu.cn (8.12.11/8.12.11) with ESMTP id i9G0EVlm030752
	for <han@ccert.edu.cn>; Sat, 16 Oct 2004 08:14:32 +0800
Received: (from qa@localhost)
	by rbl.ccert.edu.cn (8.12.11/8.12.11/Submit) id i9G0EVSi030751;
	Sat, 16 Oct 2004 08:14:31 +0800
Date: Sat, 16 Oct 2004 08:14:31 +0800
Message-Id: <200410160014.i9G0EVSi030751@rbl.ccert.edu.cn>
Subject: =?gb2312?B?ofEgztK1xMXz09Eg0uy12MG1x+kg0KHM7Lbsyq608w==?=
To: han@ccert.edu.cn
From: Tran Quang Anh <chi@cernet.edu.cn>
Content-Type: multipart/mixed; boundary="----------=_1097885672-2811-72"
MIME-Version: 1.0
X-UIDL: )+[!!?A)"!%/l"!~XO"!

大三了,我们的恋情维系了三年.
   可是,越来越不知道自己在坚持什么.
   坚信他是最适合我的人，因为在一起的时候很快乐.
   可是一旦开学,被分开----距离拉开了，美没了
   因为相信地久天长,因为拿不起,放不下
   身为射手女生,是不是有点名不副实呢?
   吵架的时间居多,怀疑是否相爱,是否在乎对方,
   有时候嘲笑自己的幼稚,可是脾气上来了,就忍不住去伤害
   有时候甚至佩服起自己来,竟然这么久!~
   身边出现了一些人,可是最终还是选择他.因为一份执着吧.
   那些可以天天在一起的恋人们,你们真的很幸福哦.要珍惜呢.
   那些和我一样,仍在坚持着的"单身恋人",你们怎么想呢?
```

</details>

<details>
  <summary>data/spam 文件 793.txt</summary>

```
Return-Path: <qian@163.com>
Received: from 163.com ([61.144.65.194])
	by spam-gw.ccert.edu.cn (MIMEDefang) with ESMTP id j6ALQwsR008055
	for <han@ccert.edu.cn>; Mon, 11 Jul 2005 05:26:59 +0800 (CST)
Message-ID: <200507110526.j6ALQwsR008055@spam-gw.ccert.edu.cn>
From: =?GB2312?B?wda6ow==?= <qian@163.com>
Subject: =?gb2312?B?1sKjqL6twO0vssbO8aOpytWjug==?=
To: han@ccert.edu.cn
Content-Type: text/plain;charset="GB2312"
Reply-To: qian@163.com
Date: Mon, 11 Jul 2005 05:40:52 +0800
X-Priority: 3
X-Mailer: Foxmail 4.2 [cn]

*******************广州市兴地贸易有限公司*********************

(负责人/经理/财务）您好：
    本公司代理多家公司操作帐务，具有丰富财务经验.可向贵司提供：
（普通销售/服务行业/广告行业/建筑行业/运输行业）发票，只收2%
的税点。若有意，请联系！

            联 系 人：林海
            联系电话：020-31946660    13824444525

承诺：发票一律通过正规手续从税务局办理领购，保证随时查询验证。

本邮件属群发邮件对你造成不便敬请原谅！！

************************欢迎来电咨询****************************
```

</details>

他们的区别很明显，一种是个人记录的，一种是推销产品的。

最后，还有一个“中文停用词表”，这里“停用词”的含义是：语句中的介词、转折词、语气词等，无法表达语句主要含义的词语。

<details>
  <summary>中文停用词表节选：</summary>

```
,
?
、
。
“
”
《
》
！
，
：
；
？
.
(
)
{
}
[
]
<
>
@
+
-
=
*
末##末
啊
阿
哎
哎呀
哎哟
唉
俺
俺们
按
按照
吧
吧哒
把
罢了
被
本
本着
比
比方
比如
鄙人
彼
彼此
边
别
别的
别说
并
并且
```

</details>

通过中文停用词表，可以对**分词**之后的文本进行过滤，最后得到**有意义的部分**，也就是能代表整个语句的**特征**。

> **分词释义**: 将文本按照预设的语法规则进行分割。举例：

| 序号 | 原文                 | 正向最长匹配                                 | 逆向最长匹配                                 | 双向最长匹配                                 |
| ---- | -------------------- | -------------------------------------------- | -------------------------------------------- | -------------------------------------------- |
| 1    | 项目的研究           | ['项目', '的', '研究']                       | ['项', '目的', '研究']                       | ['项', '目的', '研究']                       |
| 2    | 商品和服务           | ['商品', '和服', '务']                       | ['商品', '和', '服务']                       | ['商品', '和', '服务']                       |
| 3    | 研究生命起源         | ['研究生', '命', '起源']                     | ['研究', '生命', '起源']                     | ['研究', '生命', '起源']                     |
| 4    | 当下雨天地面积水     | ['当下', '雨天', '地面', '积水']             | ['当', '下雨天', '地面', '积水']             | ['当下', '雨天', '地面', '积水']             |
| 5    | 结婚的和尚未结婚的   | ['结婚', '的', '和尚', '未', '结婚', '的']   | ['结婚', '的', '和', '尚未', '结婚', '的']   | ['结婚', '的', '和', '尚未', '结婚', '的']   |
| 6    | 欢迎新老师生前来就餐 | ['欢迎', '新', '老师', '生前', '来', '就餐'] | ['欢', '迎新', '老', '师生', '前来', '就餐'] | ['欢', '迎新', '老', '师生', '前来', '就餐'] |

> 当某个文本拥有类似的特征时，也就能类似的认为，该文本具有相同的结论——比如都是垃圾邮件。

### 2.2.2 编码实现

代码步骤如下：

- 1、读取中文停用词表，构造一个过滤字符的字符串数组；
- 2、读取某个文件，排除文件的非中文部分；
- 3、对中文文本进行分词，得到一个字符串数组（这就是描述该文件的特征）；
- 4、生成一个新的文件，存储特征字符串；
- 5、重复 2 ～ 4 步骤，得到全部文件的特征文件。

> 笔者原本打算使用 python 代码来表示，但是<a href="/files/nlp/pythonCode.zip" target="_blank">源代码</a>是 2019 年写，既没有输出中间结果(特征放内存里面了)，又多了模型评估的部分，不太适合本文的节奏，所以现在改用 nodejs 重写一遍。

在 data 文件夹的同级目录下创建 vector 文件夹，并在其中创建 spam 和 normal 文件夹。

在 data 文件夹的同级目录下创建 vector.js 文件。

此时的文件结构是这样的：

```bash
➜  emailCode tree -L 2
.
├── data
│   ├── normal
│   ├── spam
│   ├── test
│   └── 中文停用词表.txt
├── vector
│   ├── normal
│   └── spam
└── vector.js

8 directories, 2 files
```

其中 vector.js 代码如下：

```js
// vector.js
const fs = require("fs");
const iconv = require("iconv-lite");
const path = require("path");
const nodejieba = require("nodejieba");

function filterNonChinese(str) {
  return str.replace(/[^\u4e00-\u9fa5]/g, "");
}

function stringToVector(fileContent) {
  // 构造一个分割字符的字符串数组
  const buffer = fs.readFileSync("./data/中文停用词表.txt");
  const fileText = iconv.decode(buffer, "gbk");
  const stpoWords = fileText.split("\n");

  // 匹配非中文字符并删除
  const fileChineseContent = filterNonChinese(fileContent);
  // 根据 nodejieba 进行分词
  const tokens = nodejieba.cut(fileChineseContent);
  // 根据停用词表进行过滤
  const filteredData = tokens.filter((item) => !stpoWords.includes(item));
  return filteredData;
}

function generateVector(sourceDirPath, outDirPath, stpoWords) {
  const files = fs.readdirSync(sourceDirPath);
  // 遍历每个文件并读取它们的内容

  files.forEach((file, index) => {
    const filePath = path.join(sourceDirPath, file);
    // 读取文件内容
    const buffer = fs.readFileSync(filePath);
    const fileContent = iconv.decode(buffer, "gbk");
    // 获得特征向量
    const data = stringToVector(fileContent);
    // 将结果写入文件中保存
    fs.writeFileSync(path.join(outDirPath, file), data.join("\n"), "utf8");
    console.log(`处理进度：${index + 1}/${files.length}`);
  });
}

function main(params) {
  // 开始分割，输出在 vector 中
  generateVector("./data/normal", "./vector/normal");
  generateVector("./data/spam", "./vector/spam");
}

// 执行一次这个
// main();

module.exports = {
  stringToVector,
};
```

### 2.2.3 结果展示

经过处理之后，以 2.2.1 节中的两个文件为例，展示一下输出结果：

<details>
  <summary>vector/normal 文件 274.txt</summary>

```js
[
  "大三",
  "恋情",
  "维系",
  "三年",
  "越来越",
  "知道",
  "坚持",
  "坚信",
  "最",
  "适合",
  "人",
  "一起",
  "快乐",
  "开学",
  "分开",
  "距离",
  "拉开",
  "美",
  "相信",
  "地久天长",
  "放不下",
  "身为",
  "射手",
  "女生",
  "是不是",
  "有点",
  "名不副实",
  "吵架",
  "时间",
  "居多",
  "怀疑",
  "是否",
  "相爱",
  "是否",
  "在乎",
  "对方",
  "有时候",
  "嘲笑",
  "幼稚",
  "脾气",
  "忍不住",
  "伤害",
  "有时候",
  "佩服",
  "这么久",
  "身边",
  "出现",
  "一些",
  "人",
  "最终",
  "选择",
  "一份",
  "执着",
  "天天",
  "一起",
  "恋人们",
  "真的",
  "幸福",
  "珍惜",
  "坚持",
  "单身",
  "恋人",
  "想",
];
```

</details>

<details>
  <summary>vector/spam 文件 793.txt</summary>

```js
[
  "广州市",
  "兴",
  "贸易",
  "有限公司",
  "负责人",
  "经理",
  "财务",
  "您好",
  "公司",
  "代理",
  "多家",
  "公司",
  "操作",
  "帐务",
  "具有",
  "丰富",
  "财务",
  "经验",
  "贵",
  "司",
  "提供",
  "普通",
  "销售",
  "服务行业",
  "广告行业",
  "建筑行业",
  "运输",
  "行业",
  "发票",
  "只",
  "收",
  "税",
  "点",
  "有意",
  "请",
  "联系",
  "联系人",
  "林海",
  "联系电话",
  "承诺",
  "发票",
  "一律",
  "正规",
  "手续",
  "税务局",
  "办理",
  "领购",
  "保证",
  "随时",
  "查询",
  "验证",
  "邮件",
  "属",
  "群",
  "发邮件",
  "造成",
  "不便",
  "敬请原谅",
  "欢迎",
  "来电",
  "咨询",
];
```

</details>

## 2.3 模型训练

### 2.3.1 算法原理回顾

回顾 2.2.3 节中的特征，可以得到一个初步结论：当某个邮件中中，大量含有 spam 中的词语，那么可以认为这个邮件大概率是垃圾邮件；反之同理。

这里引出的一个问题是：这个“概率”该怎么去量化？

我们很自然的想到，邮件中的词语对结果影响的权重是不同的，也就是影响的力度和方向是不同的。

> 笔者：回顾“向量”的定义，同时具有方向和大小的量。在这个场景中，方向只有两个：是或不是垃圾邮件；而大小则表示对结果影响的权重。

进而想到，我们需要计算**特征向量**的具体值，从而能够判断输入的邮件最终具有怎样的结果倾向。

那么计算方法是什么？

再回顾 1.1~1.3 节中关于贝叶斯定理的描述。

**我们能够基于已有的事实反过来推测它发生的概率：**

$$
P(A \mid B) = \frac{P(B \mid A) P(A)}{P(B)}
$$

这里直接变换为：

$$
P(是 \mid 特征1) = \frac{P(特征1 \mid 是) P(是)}{P(特征1)} \\
P(是 \mid 特征2) = \frac{P(特征2 \mid 是) P(是)}{P(特征2)} \\
... \\
... \\
... \\
P(是 \mid 特征n) = \frac{P(特征n \mid 是) P(是)}{P(特征n)} \\
$$

于是我们需要计算等式右侧的变量。

再回顾 2 节介绍部分，在 NLP 领域有两个研究方法：基于规则的方法和基于统计的方法。

我们选择**基于统计**的方法，于是能够“通过频率来模拟概率”。

例如 P(特征 1 | 是) 的值，可以这样假设：

垃圾邮件中，假设全部特征词语有 m 个，特征 1 这个词语有 n 个，也就是出现了 n 次，那么它出现的频率就是 n/m。

所以 P(特征 1 | 是) = n/m 。

> 数据量越丰富，这个值也就越准确。从这里也可以感受一下大数据的含义。

### 2.3.2 算法实现

在 data 文件夹的同级目录下创建 train.js 文件。

此时的文件结构是这样的：

```bash
➜  emailCode tree -L 2
.
├── data
│   ├── normal
│   ├── spam
│   ├── test
│   └── 中文停用词表.txt
├── train.js
├── vector
│   ├── normal
│   └── spam
└── vector.js

8 directories, 3 files
```

其中 train.js 代码如下：

```js
// train.js
const fs = require("fs");
const path = require("path");
const { stringToVector } = require("./vector");
const iconv = require("iconv-lite");

/**
 *
 * @param {string} sourceDirPath
 * @param {Map} map
 * @returns
 */
function addMap(sourceDirPath, map) {
  let count = 0;
  const files = fs.readdirSync(sourceDirPath);
  files.forEach((file) => {
    const filePath = path.join(sourceDirPath, file);
    // 读取文件内容
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const words = fileContent.split("\n");
    count += words.length;
    words.map((word) => {
      map.set(word, (map.get(word) ?? 0) + 1);
    });
  });
  return count;
}

// 1、统计得到每个词语出现的次数、总词语个数
const normalWords = new Map();
const spamWords = new Map();
const normalWordsCount = addMap("./vector/normal", normalWords);
const spamWordsCount = addMap("./vector/spam", spamWords);

// 2、朴素贝叶斯算法——计算概率值
function calProb(word) {
  if (!normalWords.has(word) && !spamWords.has(word)) {
    return 0.47;
  }
  const pw_n = normalWords.has(word)
    ? normalWords.get(word) / normalWordsCount
    : 0.01;
  const pw_s = spamWords.has(word)
    ? spamWords.get(word) / spamWordsCount
    : 0.01;
  ps_w = pw_s / (pw_s + pw_n);
  return ps_w;
}

function calBayes(testVector) {
  let ps_w = 1;
  let ps_n = 1;
  testVector.forEach((word) => {
    const prob = calProb(word);
    ps_w *= prob;
    ps_n *= 1 - prob;
  });
  const p = ps_w / (ps_w + ps_n);
  return p;
}

// 3、简单测试
const testVector1 = stringToVector(
  iconv.decode(fs.readFileSync("./data/normal/274.txt"), "gbk")
);
const testVector2 = stringToVector(
  iconv.decode(fs.readFileSync("./data/spam/793.txt"), "gbk")
);
const testVector3 = stringToVector(
  iconv.decode(fs.readFileSync("./data/test/1.txt"), "gbk")
);
const testVector4 = stringToVector(
  iconv.decode(fs.readFileSync("./data/test/8000.txt"), "gbk")
);

console.log(calBayes(testVector1.slice(0, 15))); // 0.00327150967855315
console.log(calBayes(testVector2.slice(0, 15))); // 1
console.log(calBayes(testVector3.slice(0, 15))); // 9.756882688122813e-9
console.log(calBayes(testVector4.slice(0, 15))); // 1
```

### 2.3.3 代码解释

- 函数 calProb

传入参数是一个词语，返回值是一个概率值，表示“这个词语存在时，该邮件更倾向于垃圾邮件，或者更倾向于正常邮件”。

pw_n 表示该词在所有 normal 邮件中出现的频率，如果不存在，设置经验值 0.01；
pw_s 表示该词在所有 spam 邮件中出现的频率，如果不存在，设置经验值 0.01；
ps_w 表示了一个倾向，经验值为 0.47；

- 函数 calBayes

传入值是需要判断的邮件的特征向量，返回值是一个概率值，表示“综合来看，该邮件是垃圾邮件的概率”。

- 测试代码

因为数字计算精度问题，所以只取了一部分看看效果。

# 3 总结

好啦，到这里告一段落，可以简单总结下。

回顾本文目标：

- 1 理解**朴素贝叶斯算法**原理
- 2 了解**基于统计的自然语言处理**的原理
- 3 理解**机器学习模型**的原理
- 4 成功完成训练**机器学习模型**的实践
- 5 理解并运用**模型评价指标**(略)

主要内容都已经涉及到了。第 5 部分，可以使用 data 中 test 的数据去测试，它们的文件名称就是标记。

我们可以看到，算法实现部分的代码是相对很少的，更多的是对数据的处理，构造更好的输入。这也侧面说明了，很多人选择使用 python 的原因就是它有非常多好用的数据处理的库。为了说明朴素贝叶斯算法的作用，我们就没有直接调用“贝叶斯库”这样的 API 。

于是，我们可以基于现有的资料，向上包装一些业务代码，构建一个可执行文件。它的输入是邮件文本信息，输出是一个概率值。

最后，我们可以得到一个简单的二分类器（判断是或否），也就是一个机器学习模型了。
