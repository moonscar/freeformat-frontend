# AI Formatter 前端（Next.js）

- 技术栈：Next.js（App Router）+ TailwindCSS
- 部署：Vercel
- 国际化：通过中间件跳转 `/zh` 与 `/en`

## 本地启动

```bash
cd frontend
npm install   # 或 pnpm i / yarn
npm run dev   # http://localhost:3000
```

## 目录说明
- `src/app/[locale]/page.tsx`：首页（以“格式要求”为主的工具入口）
- `src/app/[locale]/templates`：模板列表（SEO 入口）
- `src/app/robots.ts`、`src/app/sitemap.ts`：SEO 基础
- `src/components`：上传与模板相关组件（占位，待接后端）

## Todo
- [x] 调整落地页配色与提交流程，让用户快速填写核心信息
- [x] 部署落地页至 Vercel 并验证核心路径
- [x] 接入分析（Umami/GA4 可选）、配置 metadata/robots/sitemap
- [x] 完成 ESLint/Prettier 初始化，确保 `npm run lint` 可直接运行
- [ ] 根据获客反馈评估并排期下一波开发计划（下列任务待排序）
- [ ] 将上传与格式化流程接入后端 API（FastAPI）
- [ ] 引入模板数据源（静态/MDX 或 API）
- [ ] 打磨 UI，补充前后对比、FAQ、隐私页面

## SEO & 分析配置
1. 复制 `.env.example` 为 `.env.local`，填写 `NEXT_PUBLIC_SITE_URL`、`NEXT_PUBLIC_REQUEST_EMAIL` 以及可选的 Umami/GA4 变量。
2. 重新部署后，`metadataBase`、`robots` 与 `sitemap` 会根据该域名自动生成正确链接。
3. 若设置 `NEXT_PUBLIC_UMAMI_*` 或 `NEXT_PUBLIC_GA_ID`，Analytics 组件会自动注入对应脚本，无需额外改动代码。
