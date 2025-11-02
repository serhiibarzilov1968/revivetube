export default function Home() {
  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          ReviveTube — automatic YouTube channel promotion service
        </h1>
        <p className="mt-3 text-slate-600">
          Автоматический сервис продвижения YouTube-канала
        </p>

        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <a
            href="/audit?lang=en"
            className="px-6 py-3 rounded-2xl bg-black text-white text-sm uppercase tracking-wide"
          >
            Audit Channel
          </a>
          <a
            href="/services"
            className="px-6 py-3 rounded-2xl border text-sm uppercase tracking-wide"
          >
            Service Tools
          </a>
        </div>

        <p className="mt-12 text-xs text-slate-500">
          Fully automated system. No managers. No waiting.  
          Click — process — result.
        </p>
      </div>
    </section>
  );
}
