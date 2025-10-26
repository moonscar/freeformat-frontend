"use client";
import { useRef, useState } from 'react';

export default function UploadBox({ label }: { label: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div
      className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".docx"
        hidden
        onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
      />
      <div className="text-gray-600">{fileName ?? label}</div>
      <button className="mt-3 px-4 py-2 bg-black text-white rounded disabled:opacity-50" disabled>
        即将支持：一键格式化
      </button>
    </div>
  );
}

