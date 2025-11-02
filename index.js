export default function Home() {
  return (
    <section className="py-16">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold">ReviveTube — автоматический аудит YouTube</h1>
        <p className="mt-4 text-slate-600">
          Быстрый аудит канала: ошибки, приоритеты и план на 7 дней.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <a href="/audit?lang=ru" className="px-5 py-3 rounded-2xl bg-black text-white">Заказать аудит</a>
          <a href="/audit?lang=en" className="px-5 py-3 rounded-2xl border">Audit (EN)</a>
        </div>
      </div>
    </section>
  );
}
