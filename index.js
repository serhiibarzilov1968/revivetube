export default function Home() {
  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold">
          ReviveTube — автоматический сервис продвижения YouTube-канала
        </h1>
        <p className="mt-4 text-slate-600">
          Никаких менеджеров. Никаких ожиданий. Нажмите кнопку — получите результат.
        </p>

        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <a href="/services" className="px-5 py-3 rounded-2xl bg-black text-white">
            Услуги
          </a>
          <a href="/audit?lang=ru" className="px-5 py-3 rounded-2xl border">
            Запустить аудит
          </a>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          <Card title="Аудит канала" desc="Автоанализ ошибок, приоритетов и план на 7 дней." href="/order?service=audit&price=9.9" />
          <Card title="Оформление канала" desc="Баннер, логотип, аватар по гайдам YouTube." href="/order?service=branding&price=14.9" />
          <Card title="SEO-правки" desc="Описание, теги, ключевые слова, базовые метаданные." href="/order?service=seo-fix&price=9.9" />
        </div>

        <p className="mt-6 text-xs text-slate-500">
          Все процессы выполняются автоматически. Результаты приходят на ваш e-mail.
        </p>
      </div>
    </section>
  );
}

function Card({ title, desc, href }) {
  return (
    <a href={href} className="border rounded-2xl p-5 hover:shadow-sm transition">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-slate-600 mt-2 text-sm">{desc}</p>
      <span className="inline-block mt-4 text-sm underline">Запустить</span>
    </a>
  );
}
