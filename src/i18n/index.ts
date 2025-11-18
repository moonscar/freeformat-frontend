export type Locale = 'zh' | 'en';

// Page-level strings
const pages = {
  zh: {
    common: {
      siteTitle: 'FreeFormat – AI 文档自动排版（毕业论文与学术文档）',
      siteDesc:
        'FreeFormat 是一款 AI 文档排版工具（AI document formatter），优先支持毕业论文与期刊论文。上传/粘贴格式要求生成模板，一键将 APA、MLA 或学校要求应用到 docx。',
    },
    landing: {
      badge: '内测优先通道 · 免费试用',
      heroTitle: 'FreeFormat · AI 文档排版工具',
      heroDesc:
        'FreeFormat 是一款面向毕业论文与期刊论文的 AI 文档排版工具。欢迎提交你正在/即将面临的格式要求，我们将优先适配 thesis format / academic paper format，并回信告知进度。',
      cta: { primary: '立即提交格式', secondary: '查看模板' },
      features: { title: '核心功能', items: ['支持毕业论文与期刊论文', 'docx 解析', '模板应用', '差异报告（即将）'] },
      howItWorks: { title: '工作原理', steps: ['发送格式要求到邮箱', '我们生成模板并回信', '正式版上线后一键排版并下载'] },
      links: { title: '更多', templates: '模板列表', privacy: '隐私与使用限制' },
      inline: {
        title: '在线提交你的格式要求（直连后端）',
        desc: '填写核心信息后点击提交，后端将登记你的格式要求并进入处理队列。',
        submit: '提交格式要求',
        success: '提交成功，Submission ID',
        apiHint: '已提交到后端 /guideline',
      },
      info: {
        subheads: { overview: '概览', steps: '步骤', cases: '使用场景' },
        what: {
          title: '什么是 FreeFormat（AI 文档排版工具）？',
          paragraphs: [
            'FreeFormat 是一款 AI 文档排版工具（AI document formatter），可以把自然语言的格式要求转成结构化模板，并自动应用到论文的字体、字号、段前后距、编号与图表标题等样式。',
            '我们优先覆盖毕业论文与期刊论文的常见规范，包括常见的 thesis format 与 academic paper format，让你把时间花在内容而不是排版上。',
          ],
        },
        how: {
          title: '如何使用？',
          steps: [
            '粘贴或上传格式要求（可包含 APA / MLA / 学校自定义要求）',
            '我们生成/校验模板（常见规范提供预置模板）',
            '上传 .docx 论文或学术文档',
            '发起格式化，一键应用 thesis format / academic paper format',
            '下载排版后的文档，查看差异（即将）',
          ],
        },
        use: {
          title: '可以用来做什么？',
          items: [
            '毕业论文提交前一键排版（thesis format）',
            '研究者/学者按期刊投稿规范排版（academic paper format）',
            '导师/教务批量验证格式（中期）',
          ],
        },
        faq: {
          title: '常见问题',
          items: [
            { q: '会修改正文内容吗？', a: '不会。系统仅调整样式与排版，不会更改正文语义。' },
            { q: '支持哪些场景？', a: '当前重点支持毕业论文与期刊论文，后续扩展更多规范。' },
            { q: '我的文件安全吗？', a: '仅用于排版处理，产物会在一段时间后清理。详见隐私说明。' },
            { q: '失败如何处理？', a: '可重试并提供原始指南；我们会持续改进模板，并提供人工确认路径。' },
          ],
        },
      },
    },
    tool: {
      heroTitle: '论文格式化工具（预览）',
      heroDesc: '支持毕业论文与期刊论文：上传/粘贴格式要求自动生成模板，或使用已有模板；上传 .docx 一键应用样式。',
      placeholderTitle: '工具区（即将开放）',
      placeholderDesc: '我们正在完善模板选择、上传与格式化流程。欢迎先在首页提交你的格式要求。',
      links: { templates: '模板列表', privacy: '隐私与使用限制' },
    },
  },
  en: {
    common: {
      siteTitle: 'FreeFormat – AI Document Formatter for Theses & Academic Papers',
      siteDesc:
        'FreeFormat is an AI document formatter that turns your guideline into a template and applies the right thesis format or academic paper format to your .docx.',
    },
    landing: {
      badge: 'Early Access · Free While In Beta',
      heroTitle: 'FreeFormat · AI Document Formatter',
      heroDesc:
        'FreeFormat is an AI document formatter for theses and academic papers. Send us your guideline – we focus on thesis format and academic paper format first and will reply with progress updates.',
      cta: { primary: 'Submit a guideline', secondary: 'Explore templates' },
      features: { title: 'Features', items: ['Supports theses and journal papers', 'Docx parsing', 'Template styling', 'Diff report (soon)'] },
      howItWorks: { title: 'How it works', steps: ['Email us your guideline', 'We build a template & reply', 'Format & download when GA is ready'] },
      links: { title: 'More', templates: 'Templates', privacy: 'Privacy & Usage Limits' },
      inline: {
        title: 'Submit your guideline (direct to backend)',
        desc: 'Fill in the essentials and submit. The backend will register your request and queue it for processing.',
        submit: 'Submit guideline',
        success: 'Submitted. Submission ID',
        apiHint: 'POST /guideline (backend)',
      },
      info: {
        subheads: { overview: 'Overview', steps: 'Steps', cases: 'Use cases' },
        what: {
          title: 'What is FreeFormat (AI document formatter)?',
          paragraphs: [
            'FreeFormat is an AI document formatter that converts natural‑language guidelines into a structured template and applies styles such as font, size, spacing, numbering, and captions automatically.',
            'We focus on theses and academic papers (thesis format and academic paper format) so you can spend time on content, not formatting.',
          ],
        },
        how: {
          title: 'How to use',
          steps: [
            'Paste or upload your formatting guideline (APA, MLA or custom)',
            'We build/verify a template (popular thesis and academic paper formats pre‑built)',
            'Upload your .docx thesis or academic paper',
            'Start formatting with the right thesis format / academic paper format',
            'Download and review the diff (soon)',
          ],
        },
        use: {
          title: 'Use cases',
          items: [
            'Thesis submission formatting (thesis format)',
            'Journal submission formatting (academic paper format)',
            'Bulk compliance checks for advisors/admins (mid‑term)',
          ],
        },
        faq: {
          title: 'FAQ',
          items: [
            { q: 'Do you change my content?', a: 'No. We only apply styles and layout, not the text itself.' },
            { q: 'What scenarios are supported?', a: 'We prioritize theses and journal submissions and will expand further.' },
            { q: 'Is my file safe?', a: 'Files are processed for formatting only and cleaned up later. See Privacy.' },
            { q: 'What if formatting fails?', a: 'Retry and share the guideline; we keep improving templates and provide a human‑in‑the‑loop path.' },
          ],
        },
      },
    },
    tool: {
      heroTitle: 'Academic Paper Formatting (Preview)',
      heroDesc: 'Theses and journal submissions supported: paste/upload guideline to generate a template or use existing ones; upload .docx to apply styles.',
      placeholderTitle: 'Tool area (coming soon)',
      placeholderDesc: 'We are implementing template picking, upload and formatting. Meanwhile, submit your guideline on the landing page.',
      links: { templates: 'Templates', privacy: 'Privacy' },
    },
  },
} as const;

// Component-level strings
export const inlineForm = {
  zh: {
    requirementLabel: '格式要求原文（必填）',
    requirementPlaceholder: '直接粘贴格式要求，越详细越好',
    contactLabel: '邮箱 / 联系方式（必填）',
    contactPlaceholder: '我们会把模板进度回信给你',
    extrasTitle: '补充信息（选填）',
    extrasFields: {
      org: '学校 / 院系 / 期刊（选填）',
      link: '格式要求链接（选填）',
      pages: '文档类型或页数（选填）',
      deadline: '截止日期（选填）',
    },
    specialPlaceholder: '特殊要求或备注（选填）',
    successSeparator: '：',
    errorPrefix: '提交失败',
    defaultResult: '已接收',
    loadingText: '提交中…',
    fallbackName: '用户上传格式要求',
    subjectPrefix: '格式要求 - ',
    subjectFallback: '未填写机构',
    compose: {
      org: '【学校/院系/期刊】',
      link: '【格式要求链接/附件】',
      doc: '【文档类型/页数/DDL】',
      special: '【特殊要求】',
      contact: '【联系方式】',
      rawPrefix: '【格式要求原文】\n',
    },
    mailError: '无法唤起邮箱，请手动复制内容发送。',
  },
  en: {
    requirementLabel: 'Formatting guideline (required)',
    requirementPlaceholder: 'Paste the full requirement. More detail gets faster support.',
    contactLabel: 'Email / contact (required)',
    contactPlaceholder: 'We will email progress updates and template ID.',
    extrasTitle: 'Optional info (helps prioritization)',
    extrasFields: {
      org: 'School / Department / Journal (optional)',
      link: 'Guideline link (optional)',
      pages: 'Doc type or pages (optional)',
      deadline: 'Deadline (optional)',
    },
    specialPlaceholder: 'Special notes (optional)',
    successSeparator: ': ',
    errorPrefix: 'Submit failed',
    defaultResult: 'Submitted',
    loadingText: 'Submitting…',
    fallbackName: 'User guideline submission',
    subjectPrefix: 'Formatting guideline - ',
    subjectFallback: 'Unknown organization',
    compose: {
      org: 'Organization: ',
      link: 'Guideline link / attachment: ',
      doc: 'Doc type / pages / deadline: ',
      special: 'Special notes: ',
      contact: 'Contact: ',
      rawPrefix: 'Guideline:\n',
    },
    mailError: 'Unable to open email client. Please copy and send manually.',
  },
} as const;

export function getT(locale: Locale) {
  const l = (locale === 'en' ? 'en' : 'zh') as Locale;
  return pages[l];
}
