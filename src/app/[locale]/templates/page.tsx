export default function TemplatesPage() {
  // Placeholder list; can be replaced with real data or MDX content
  const templates = [
    { slug: 'thesis-default', name: '通用毕业论文模板' },
    { slug: 'cn-university-a', name: '示例高校 A 模板' },
  ];

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-4">
      <h1 className="text-2xl font-bold">模板列表</h1>
      <ul className="grid md:grid-cols-2 gap-4">
        {templates.map((t) => (
          <li key={t.slug} className="border rounded p-4">
            <div className="font-medium">{t.name}</div>
            <div className="text-sm text-gray-600">/{t.slug}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}

