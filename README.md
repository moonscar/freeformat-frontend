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

> 详细待办维护在 `../docs/frontend_todolist.md`。

## SEO & 分析配置
1. 复制 `.env.example` 为 `.env.local`，填写 `NEXT_PUBLIC_SITE_URL`、`NEXT_PUBLIC_REQUEST_EMAIL` 以及可选的 Umami/GA4 变量。
   - 目前默认值指向正式域名 `https://freeformat.app`。
2. 重新部署后，`metadataBase`、`robots` 与 `sitemap` 会根据该域名自动生成正确链接。
3. 若设置 `NEXT_PUBLIC_UMAMI_*` 或 `NEXT_PUBLIC_GA_ID`，Analytics 组件会自动注入对应脚本，无需额外改动代码。

## 今日进展
- ✅ 落地页完成浅色视觉与交互打磨，Hero/价值块统一配色
- ✅ 在线表单改为生成邮件草稿，支持中英文文案 & 邮箱配置
- ✅ SEO 元信息/JSON-LD 本地化，接入 Umami/GA4（可配）
- ✅ 前后端 Todo 梳理完毕，锁定下一阶段重点

## 明日计划
1. 前端：搭建 FAQ/案例页面，准备 5-7 个高频问题（中/英）
2. 后端：开工 Guideline API MVP，定义 Schema + 示例响应
