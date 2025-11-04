import Link from "next/link";

const CURRENCY_SIGN = process.env.NEXT_PUBLIC_CURRENCY_SIGN || "$";
const SERVICES = [
  { key: "memo-shorts", title: "Мемо-Shorts (ИИ-памятка)",   price: 19.9,   desc: "Сформируйте вопрос — получите вертикальный шортс с ИИ-озвучкой и титрами." },
  { key: "audit-pro", title: "Развёрнутый аудит (30 дней)", price: 24.9, desc: "Глубокий анализ: канал, ниша, конкуренты, SEO и план на 30 дней." },
  { key: "branding",  title: "Оформление канала",        price: 14.9, desc: "Баннер + логотип + аватар по гайдам YouTube." },
  { key: "seo-fix",   title: "SEO-правки канала",        price: 9.9,  desc: "Описание, теги, ключевые слова, базовые метаданные." },
  { key: "shorts",    title: "Шортс из вашего контента", price: 19.9,  desc: "Сделаем 1 Shorts из видео/текста/аудио." },
  { key: "video",     title: "Работа с видео",           price: 9.9,  desc: "Обложка, название, описание, теги и рекомендации." },
  { key: "manager",   title: "Ведение (менеджер)",       price: 99.90, desc: "Подключение менеджера: весь спектр услуг + минимум 1 шортс/неделю." },
  // Дополнительные модули
  { key: "banner",    title: "Новый баннер",             price: 5.9,  desc: "Баннер канала в нужных размерах." },
  { key: "logo",      title: "Новый логотип",            price: 4.9,  desc: "Минималистичный логотип под YouTube." },
  { key: "avatar",    title: "Новый аватар",             price: 4.9,  desc: "Аватар в едином стиле." },
  { key: "desc",      title: "Описание канала",          price: 6.9,  desc: "Оптимизированное SEO-описание." },
  { key: "tags",      title: "Теги для канала",          price: 6.9,  desc: "Автоподбор релевантных тегов." },
  { key: "topic",     title: "Тема/концепт канала",      price: 9.9,  desc: "Подбор рабочей темы под нишу." },
  { key: "niche",     title: "Анализ ниши",              price: 9.9,  desc: "Потенциал, конкуренция, аудитория." },
  { key: "competitors", title: "Анализ похожих каналов", price: 9.9,  desc: "Сравнение и выводы по конкурентам." },
  { key: "ideas",     title: "Идеи для видео (10+)",     price: 9.9,  desc: "Свежие идеи по ключевым запросам." },
];

export default function Services() {
  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold">Автоматические услуги</h1>
        <p className="mt-2 text-slate-600">Никаких менеджеров. Нажмите — заполните — получите результат.</p>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map(s => (
            <div key={s.key} className="border rounded-2xl p-5 flex flex-col">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{s.title}</h3>
                <p className="text-slate-600 mt-2 text-sm">{s.desc}</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-base font-semibold">{s.price.toFixed(2)} €</div>
                <Link
                  href={`/order?service=${s.key}&price=${s.price}`}
                  className="px-4 py-2 rounded-xl bg-black text-white"
                >
                  Запустить
                </Link>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs text-slate-500">
          Сервис работает автоматически. Результат приходит на ваш e-mail. Оплата через PayPal.Me.
        </p>
      </div>
    </section>
  );
}



