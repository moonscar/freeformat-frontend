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

## 下一步
- 将上传与格式化流程接入后端 API（FastAPI）
- 引入模板数据源（静态/MDX 或 API）
- 接入分析（GA4/Umami）、配置 next-seo、设置 sitemap 域名
- 打磨 UI，补充前后对比、FAQ、隐私页面
