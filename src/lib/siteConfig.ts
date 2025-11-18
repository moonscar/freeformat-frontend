const defaultUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freeformat.app';

export const siteConfig = {
  url: defaultUrl,
  twitterHandle: '@aiformatter',
  contactEmail: 'hello@ai-formatter.com',
  locales: {
    zh: {
      title: 'FreeFormat – AI 文档排版工具（论文与学术文档）',
      description:
        'FreeFormat 是一款 AI 文档排版工具（AI document formatter），支持毕业论文与期刊论文的格式排版。上传或粘贴格式要求生成模板，按 APA、MLA 或学校要求自动应用到 .docx 文档。',
      keywords: [
        'FreeFormat',
        'AI 文档排版工具',
        'AI document formatter',
        '论文 排版',
        'thesis format',
        'academic paper format',
        'APA 论文格式',
        'MLA 论文格式',
        'docx 自动排版',
      ],
      ogLocale: 'zh_CN',
      schemaLang: 'zh-CN',
    },
    en: {
      title: 'FreeFormat – AI Document Formatter for Theses and Academic Papers',
      description:
        'FreeFormat is an AI document formatter that formats theses and academic papers to APA, MLA or custom thesis format. Paste or upload a guideline, upload your .docx and download a clean, ready-to-submit document.',
      keywords: [
        'FreeFormat',
        'AI document formatter',
        'AI document formatting tool',
        'thesis format',
        'thesis formatting',
        'academic paper format',
        'apa thesis format',
        'apa style thesis format',
        'mla paper format',
        'word document formatter',
      ],
      ogLocale: 'en_US',
      schemaLang: 'en-US',
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
