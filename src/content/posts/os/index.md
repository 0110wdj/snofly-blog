---
title: "系统安装"
published: 2024-05-27
description: ""
image: ""
tags: ["os"]
category: "问题记录"
draft: false
---

# 前言

记录一些问题的解决办法，尽量展示操作细节，并持续更新。

# 正文

## win10 启动盘制作

- 1、打开终端。
- 2、将 USB 驱动器插入。
- 3、使用 diskutil list 命令找到 USB 驱动器的标识符（如 /dev/disk2）。
- 4、使用 diskutil eraseDisk MS-DOS "WIN10" MBR /dev/disk2 命令格式化 USB 驱动器。
- 5、挂载 Windows ISO 文件：hdiutil mount /path/to/windows.iso。
- 6、将 ISO 文件内容复制到 USB 驱动器：cp -rp /Volumes/ISO_NAME/\* /Volumes/WIN10/。
