"use client";
import { useMemo } from 'react';

type EmailCopy = {
  title: string;
  desc: string;
  button: string;
  addressLabel: string;
  checklistTitle: string;
  checklist: string[];
};

export default function EmailCTA({ t }: { t: EmailCopy }) {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@your-domain.com';

  const { subject, body } = useMemo(() => {
    const s = encodeURIComponent('论文格式化需求 / Thesis Formatting Request');
    const lines = [
      '【学校/院系/期刊】：',
      '【格式要求链接/附件】：',
      '【文档类型与页数/DDL】：',
      '【特殊要求】：',
      '【联系方式】：',
      '',
      '（请按需删除不适用条目）',
    ];
    return { subject: s, body: encodeURIComponent(lines.join('\n')) };
  }, []);

  const href = `mailto:${email}?subject=${subject}&body=${body}`;

  return (
    <div className="rounded-lg border p-6 space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">{t.title}</h2>
        <p className="text-sm text-gray-600">{t.desc}</p>
      </div>
      <div className="flex items-center gap-4">
        <a
          className="inline-flex items-center justify-center px-4 py-2 rounded bg-black text-white hover:opacity-90"
          href={href}
        >
          {t.button}
        </a>
        <div className="text-sm text-gray-500">
          {t.addressLabel}：<span className="font-mono">{email}</span>
        </div>
      </div>
      <div>
        <div className="text-sm font-medium mb-1">{t.checklistTitle}</div>
        <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
          {t.checklist.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

