export type Locale = 'zh' | 'en';

// Page-level strings
const pages = {
  zh: {
    common: {
      siteTitle: 'FreeFormat – AI 文档自动排版（毕业论文与学术文档）',
      siteDesc:
        'FreeFormat 是一款论文 Word（.docx）自动排版工具，优先支持毕业论文与期刊论文。选择已有模板（APA、MLA 或学校论文格式），一键应用字体字号、行距、页边距与标题层级。',
    },
    landing: {
      badge: '免费试用 · 论文 Word 自动排版',
      heroTitle: 'FreeFormat · AI 文档排版工具',
      heroDesc:
        'FreeFormat 是一款面向毕业论文与期刊论文的 AI 文档排版工具。欢迎提交你正在/即将面临的格式要求，我们将优先适配 thesis format / academic paper format，并回信告知进度。',
      cta: { primary: '立即提交格式', secondary: '查看模板' },
      features: { title: '核心功能', items: ['支持毕业论文与期刊论文', 'docx 解析', '模板应用'] },
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
            '选择一个已有的指南/模板（如 APA、MLA 或学校论文模板）',
            '上传你的 Word（.docx）论文或学术文档',
            '点击“开始格式化”，自动应用字体字号、行距、页边距与标题层级等版式规则',
            '下载排版后的文档，并对照学校/期刊要求做最终检查',
          ],
        },
        use: {
          title: '可以用来做什么？',
          items: [
            '毕业论文提交前一键排版',
            '研究者/学者按期刊投稿规范排版',
            '导师/教务批量验证格式（中期）',
          ],
        },
        faq: {
          title: '常见问题',
          items: [
            {
              q: 'FreeFormat 能一键修哪些格式？',
              a: '重点解决重复且易错的版式：行距/段距/首行缩进（含清理空格/Tab）、正文与标题样式统一（支持多级标题/三级标题尽力而为）、参考文献“版式”（如悬挂缩进、行距等）、表题/图题等题注段落样式。',
            },
            { q: '会修改正文内容吗？', a: '不会。系统仅调整样式与排版，不会更改正文语义。' },
            {
              q: '哪些内容目前不支持或不保证？',
              a: '复杂页眉页脚与“分节页码”（如正文从 1 开始、罗马数字/阿拉伯数字混用）、目录（TOC）字段本体的修复与自动更新、多级编号体系的重建/纠错、Word 原生公式对象（OMML）的精细排版、表格内部所有细节样式、中英混排“字符级”分字体、参考文献条目的内容规范（字段顺序/标点等）。',
            },
            {
              q: '目录（TOC）/页码/多级编号问题能自动修好吗？',
              a: '目前主要保证“样式统一”，不保证自动修复 Word 的目录字段、分节页码与多级编号系统。通常建议：先用 FreeFormat 统一标题样式，再在 Word 中手动“更新目录/更新域”。',
            },
            {
              q: 'Track Changes（修订）会影响排版吗？',
              a: '可能会。修订状态下 Word 的格式行为更复杂，结果不一定稳定。建议在格式化前先接受/拒绝修订并清理批注后再上传。',
            },
          ],
        },
      },
    },
    tool: {
      heroTitle: '论文 Word 格式化工具',
      heroDesc: '支持毕业论文与期刊论文：选择已有模板，上传 Word（.docx）一键应用字体字号、行距、页边距与标题层级。',
      placeholderTitle: '工具区',
      placeholderDesc: '选择模板并上传 .docx 开始格式化。',
      links: { templates: '模板列表', privacy: '隐私与使用限制' },
    },
  },
  en: {
    common: {
      siteTitle: 'FreeFormat – AI Document Formatter for Theses & Academic Papers',
      siteDesc:
        'FreeFormat is a Word (.docx) document formatter for theses and academic papers: pick an existing template (APA/MLA/school) and apply fonts, spacing, margins and headings automatically.',
    },
    landing: {
      badge: 'Free trial · Thesis & Word auto‑format',
      heroTitle: 'FreeFormat · AI Document Formatter',
      heroDesc:
        'FreeFormat is an AI document formatter for theses and academic papers. Send us your guideline – we focus on thesis format and academic paper format first and will reply with progress updates.',
      cta: { primary: 'Submit a guideline', secondary: 'Explore templates' },
      features: { title: 'Features', items: ['Supports theses and journal papers', 'Docx parsing', 'Template styling'] },
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
            'Pick an existing guide/template (e.g., APA, MLA, or a school thesis template)',
            'Upload your Word (.docx) thesis or academic paper',
            'Click “Start formatting” to apply fonts, spacing, margins and heading styles automatically',
            'Download the formatted document and cross‑check against the official requirements',
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
            {
              q: 'What formatting issues can FreeFormat fix automatically?',
              a: 'It focuses on repetitive layout tasks: spacing and indents (including removing extra spaces/tabs), consistent body & heading styles (multi‑level headings; level‑3 best effort), reference list layout (e.g., hanging indents/spacing), and caption paragraph styles for tables/figures.',
            },
            { q: 'Do you change my content?', a: 'No. We only apply styles and layout, not the text itself.' },
            {
              q: 'What is not supported or not guaranteed yet?',
              a: 'Complex headers/footers and section‑based page numbering (e.g., Roman vs Arabic, start at 1 after front matter), fixing/updating TOC fields, rebuilding/fixing multi‑level numbering systems, fine‑grained Word equation objects (OMML), all table‑internal styling details, character‑level mixed‑language font rules, and citation/reference content rules (field order/punctuation).',
            },
            {
              q: 'Can you automatically fix TOC/page numbers/multi‑level numbering issues?',
              a: 'Not reliably yet. FreeFormat mainly guarantees style consistency. A common workflow is: apply heading styles with FreeFormat, then update the TOC/fields in Word.',
            },
            {
              q: 'Will Track Changes affect formatting?',
              a: 'It can. Track Changes makes Word formatting behavior more complex and may reduce stability. For best results, accept/reject changes and remove comments before uploading.',
            },
          ],
        },
      },
    },
    tool: {
      heroTitle: 'Thesis & Word Formatting Tool',
      heroDesc: 'Format theses and academic papers in Word (.docx): pick an existing template and apply fonts, spacing, margins and headings automatically.',
      placeholderTitle: 'Tool area',
      placeholderDesc: 'Pick a template and upload a .docx to start formatting.',
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
