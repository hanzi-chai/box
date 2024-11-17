# 形码盒子

分析和制作汉字形码输入方案的网页工具合集。访问 [box.chaifen.app](https://box.chaifen.app/)或者[本仓库的 pages](https://hanzi-chai.github.io/box/)。也可下载压缩包，解压后双击 `index.html` 文件。

## 主要功能

### 测评

-   [x] 科学形码测评系统
-   [ ] 组词能力测评系统
-   [ ] 码表基础数据
-   [ ] 赛码器

## 编译

1. clone 本仓库
2. 进入仓库后， `pnpm i` 安装依赖
3. 用 `pnpm dev` 可 HRM 预览网页
4. `pnpm build` 编译网站。`./dist`目录下就是编译产物，可以在 `file://` 协议下运行

小技巧：如果只要编译网站，而不用 HRM 预览，可以用 `pnpm i -P` 命令，它会跳过 `devDependencies` 的安装。

## 参与贡献

请阅读 `./docs` 目录下的文档。

## License

Under [MPL 2.0](LICENSE).
