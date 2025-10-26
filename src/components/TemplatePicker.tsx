"use client";
import { useState } from 'react';

const presets = [
  { id: 'thesis-default', name: '通用毕业论文模板' },
  { id: 'thesis-zh-en', name: '中英双语论文模板' },
];

export default function TemplatePicker() {
  const [selected, setSelected] = useState(presets[0].id);
  return (
    <div className="space-y-3">
      <div className="font-semibold">选择模板</div>
      <select
        className="w-full border rounded px-3 py-2"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      >
        {presets.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <button className="px-3 py-2 bg-gray-800 text-white rounded disabled:opacity-50" disabled>
        使用该模板
      </button>
    </div>
  );
}

