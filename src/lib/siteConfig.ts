const defaultUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freeformat.app';

export const siteConfig = {
  url: defaultUrl,
  twitterHandle: '@aiformatter',
  contactEmail: 'hello@ai-formatter.com',
  locales: {
    zh: {
      title: 'AI Formatter – 一键论文格式化：毕业论文与期刊投稿排版，模板与 Docx 自动样式',
      description:
        'AI Formatter 通过规则引擎 + LLM，将学术论文（毕业论文与期刊投稿）按规范自动排版。支持上传/粘贴格式要求生成模板，并一键应用到 Docx；提供任务进度与下载，差异报告即将上线。',
      keywords: ['AI Formatter', '论文排版', '毕业论文', '期刊投稿', '格式要求', '模板生成', 'docx 自动排版'],
      ogLocale: 'zh_CN',
      schemaLang: 'zh-CN',
    },
    en: {
      title: 'AI Formatter – One‑click Academic Paper Formatting | Theses & Journal Submissions',
      description:
        'AI Formatter formats academic papers to required styles using rules + LLM. Paste or upload a guideline to generate a template, upload your .docx, start formatting, and download the result. Diff report coming soon.',
      keywords: ['AI Formatter', 'academic paper formatting', 'thesis', 'journal submission', 'format guidelines', 'docx styling'],
      ogLocale: 'en_US',
      schemaLang: 'en-US',
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
