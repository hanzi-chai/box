# 按键集

也称“码元集”。码表里对编码的定义的基本单位。

## 种类

通常是支持26个字母的。有些平台（微软五笔……）只支持25个字母。而Rime支持94个ASCII可打印字符作为按键的名称，多多小小平台也支持的大量按键。初期，盒子的设计只考虑48个不需要shift的主键盘上的符号。

## 空格键

在盒子的内部数据里，空格键的编码是 ` ` 0x20，而不是 `_` 0x5F。

## 手感的处理

需要按Shift键组合打出的符号，看作不按Shift键。例如：Ab 组合的手感，用 ab 组合代替。
