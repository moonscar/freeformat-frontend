"use client";
import { useRef, useState } from 'react';

export default function GuidelineBox({ label }: { label: string }) {
  const [mode, setMode] = useState<'paste' | 'file'>('paste');
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4">
      {/* Search existing guidelines/templates */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">搜索已有格式要求/模板</label>
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded px-3 py-2"
            placeholder="学校名、规范名，如：XX大学、本科毕业论文规范"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50" disabled>
            搜索（占位）
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 text-gray-500">
        <span className="h-px flex-1 bg-gray-200" />
        <span className="text-xs">或</span>
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      {/* Paste or upload guideline to auto-generate template */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded border ${mode === 'paste' ? 'bg-gray-900 text-white' : ''}`}
            onClick={() => setMode('paste')}
          >
            粘贴文本
          </button>
          <button
            className={`px-3 py-1 rounded border ${mode === 'file' ? 'bg-gray-900 text-white' : ''}`}
            onClick={() => setMode('file')}
          >
            上传文件
          </button>
        </div>

        {mode === 'paste' ? (
          <textarea
            className="w-full h-48 border rounded p-3"
            placeholder={label}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        ) : (
          <div
            className="border-2 border-dashed rounded p-6 text-center cursor-pointer hover:bg-gray-50"
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".txt,.docx,.md,.pdf"
              hidden
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
            />
            <div className="text-gray-600">{fileName ?? '点击选择 .txt/.docx/.md/.pdf'}</div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-black text-white rounded disabled:opacity-50" disabled>
            生成模板（占位）
          </button>
          <span className="text-xs text-gray-500">稍后将调用后端生成 TemplateJSON</span>
        </div>
      </div>
    </div>
  );
}
