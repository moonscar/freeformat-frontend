const defaultUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-formatter.vercel.app';

export const siteConfig = {
  url: defaultUrl,
  twitterHandle: '@aiformatter',
  contactEmail: 'hello@ai-formatter.com',
  locales: {
    zh: {
      title: 'AI Formatter – 一键论文格式化',
      description: '按高校规范自动排版中文/英文论文，优先适配热门格式并回信通知进度。',
      keywords: ['AI Formatter', '论文排版', '毕业论文格式', '格式要求', '模板生成'],
      ogLocale: 'zh_CN',
      schemaLang: 'zh-CN',
    },
    en: {
      title: 'AI Formatter – One-click Thesis Formatting',
      description: 'Auto-format theses to university specs, prioritize popular guidelines, notify you once ready.',
      keywords: ['AI Formatter', 'thesis formatting', 'academic writing', 'format guidelines', 'docx styling'],
      ogLocale: 'en_US',
      schemaLang: 'en-US',
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
