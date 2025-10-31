export default function HeroSection({ title, desc }: { title: string; desc: string }) {
  return (
    <section className="bg-slate-900 text-white">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-200 md:text-base">{desc}</p>
      </div>
    </section>
  );
}

