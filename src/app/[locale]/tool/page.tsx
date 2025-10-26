import Link from 'next/link';
import GuidelineBox from '@/components/GuidelineBox';
import UploadBox from '@/components/UploadBox';
import TemplatePicker from '@/components/TemplatePicker';

export default function ToolPage({ params }: { params: { locale: string } }) {
  const t = params.locale === 'en' ? en : zh;
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold">{t.title}</h1>
        <p className="text-gray-600">{t.desc}</p>
      </section>

      <section className="mt-8 grid md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2 p-5 rounded-lg border">
          <h2 className="font-semibold mb-3">{t.guideline.title}</h2>
          <p className="text-sm text-gray-500 mb-4">{t.guideline.desc}</p>
          <GuidelineBox label={t.guideline.label} />
        </div>
        <div className="md:col-span-1 space-y-6">
          <div className="p-4 rounded-lg border">
            <h2 className="font-semibold mb-3">{t.upload.title}</h2>
            <p className="text-sm text-gray-500 mb-2">{t.upload.desc}</p>
            <UploadBox label={t.upload.label} />
          </div>
          <div className="p-4 rounded-lg border">
            <h2 className="font-semibold mb-2">{t.templates.title}</h2>
            <p className="text-sm text-gray-500 mb-3">{t.templates.desc}</p>
            <TemplatePicker />
            <div className="mt-2 text-sm">
              <Link href={`/${params.locale}/templates`} className="underline">
                {t.templates.link} →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const zh = {
  title: '论文格式化工具（预览）',
  desc: '上传/粘贴格式要求自动生成模板，或使用已有模板；上传 .docx 一键应用样式。功能将陆续开放。',
  guideline: {
    title: '上传/粘贴格式要求（自动生成模板）',
    desc: '支持 .txt/.docx/.md/.pdf，或直接粘贴文本说明。',
    label: '在此粘贴格式要求，或切换至“上传文件”',
  },
  upload: {
    title: '上传待格式化文档',
    desc: '支持 .docx，稍后将按模板自动排版',
    label: '拖拽上传 .docx 或点击选择',
  },
  templates: {
    title: '使用已有模板',
    desc: '从热门/最近使用模板中快速选择',
    link: '查看模板列表',
  },
};

const en = {
  title: 'Thesis Formatting Tool (Preview)',
  desc: 'Paste/upload guideline to auto-generate a template, or use existing templates; upload .docx to apply styles. Features rolling out soon.',
  guideline: {
    title: 'Paste/Upload Guideline (auto-generate template)',
    desc: 'Supports .txt/.docx/.md/.pdf or paste plain text.',
    label: 'Paste your guideline here, or switch to “Upload File”',
  },
  upload: {
    title: 'Upload Document',
    desc: 'Supports .docx. We will apply the selected template',
    label: 'Drag & drop .docx or click to select',
  },
  templates: {
    title: 'Use Existing Templates',
    desc: 'Pick from popular/recent templates',
    link: 'Browse templates',
  },
};

