export const siteConfig = {
  name: 'AI Formatter',
  description: '按高校规范自动排版中文/英文论文，支持标题、摘要、脚注等，优先适配热门格式并回信通知进度。',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-formatter.vercel.app',
  locale: 'zh_CN',
  keywords: ['AI Formatter', '论文排版', '毕业论文格式', '格式要求', '模板生成'],
  twitterHandle: '@aiformatter',
  contactEmail: 'hello@ai-formatter.com',
};

export type SiteConfig = typeof siteConfig;
