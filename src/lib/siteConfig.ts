const defaultUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freeformat.app';

export const siteConfig = {
  url: defaultUrl,
  twitterHandle: '@aiformatter',
  contactEmail: 'hello@ai-formatter.com',
  locales: {
    zh: {
      title: 'AI Formatter – APA/MLA 论文格式模板与一键排版',
      description:
        '一键将研究/毕业论文按 APA 或 MLA 规范排版。支持上传或粘贴格式要求生成模板，并将样式自动应用到 .docx；提供任务进度与下载。',
      keywords: ['AI Formatter', 'APA 论文格式', 'MLA 论文格式', '研究论文 格式', 'APA 格式 模板', 'MLA 格式 模板', 'docx 自动排版'],
      ogLocale: 'zh_CN',
      schemaLang: 'zh-CN',
    },
    en: {
      title: 'AI Formatter — APA/MLA Paper Format Templates',
      description:
        'Format research papers to APA or MLA style in one click. Use ready templates or paste a guideline, upload your .docx, and download a correctly styled paper.',
      keywords: ['AI Formatter', 'apa format paper', 'apa paper format', 'apa style paper format', 'mla paper format', 'mla format paper', 'research paper format', 'apa format paper example', 'apa research paper format', 'apa citation format journal article'],
      ogLocale: 'en_US',
      schemaLang: 'en-US',
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
