# Blog WebSite

Front-end code for my personal website.

Based on [Fuwari](https://github.com/saicaca/fuwari).

## 本地开发

```bash
pnpm install
pnpm start
```

## 构建

```bash
pnpm build
```

## GitHub Pages 自动部署

项目通过 GitHub Actions 自动部署：push 到 `main` 分支后，`.github/workflows/deploy.yml`
会自动安装依赖、构建并发布到 GitHub Pages。

首次使用需要在仓库中进行一次设置：

1. 进入仓库 **Settings → Pages**；
2. **Build and deployment → Source** 选择 **GitHub Actions**。

部署成功后访问地址为 `https://0110wdj.github.io/snofly-blog/`。

> 注意：`astro.config.mjs` 中的 `base` 必须与仓库名一致（当前为 `/snofly-blog/`），
> 如果修改了仓库名称，需要同步修改 `base`。

## 新建文章

```bash
pnpm new-post
```
