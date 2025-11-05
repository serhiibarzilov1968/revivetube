import { useRouter } from "next/router";
import { useMemo, useState } from "react";

const NAMES = {
  "memo-shorts": "Мемо-Shorts (ИИ-памятка)",
  "audit-pro": "Развёрнутый аудит (30 дней)",
  branding: "Оформление канала",
  "seo-fix": "SEO-правки канала",
  shorts: "Шортс из вашего контента",
  video: "Работа с видео",
  manager: "Ведение (менеджер)",
  // Доп. модули
  banner: "Новый баннер",
  logo: "Новый логотип",
  avatar: "Новый аватар",
  desc: "Описание канала",
  tags: "Теги для канала",
  topic: "Тема/концепт канала",
  niche: "Анализ ниши",
  competitors: "Анализ похожих каналов",
  ideas: "Идеи для видео (10+)",
};

export default function Order() {
  const { query, push } = useRouter();
  const service = String(query.service || "audit");
  const CURRENCY_CODE = process.env.NEXT_PUBLIC_CURRENCY_CODE || "USD";
  const CURRENCY_SIGN = process.env.NEXT_PUBLIC_CURRENCY_SIGN || "$";

  const price = Number(query.price || 9.9);
  const paypal = process.env.NEXT_PUBLIC_PAYPAL_ME || "";

  const title = useMemo(() => NAMES[service] || NAMES.audit, [service]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true); setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
  const r = await fetch("/api/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  // открываем PayPal в новой вкладке (если есть цена)
  if (paypal && Number(price) > 0) {
    const numeric = String(price).replace(/[^\d.]/g, ""); // чистим цифры
    const payUrl = `${paypal}/${numeric}${CURRENCY_CODE}`; // добавили валюту USD
    window.open(payUrl, "_blank");
  }

  // успешный ответ сервера
  if (r.ok) {
    push(`/thanks?lang=ru`);
  } else {
    const txt = await r.text();
    setError(txt || "Ошибка отправки");
  }
} catch (e) {
  // если fetch оборвался (типичная ошибка при открытии PayPal)
  const msg = String(e || "");
  if (msg.includes("Failed to fetch") || msg.includes("Не удалось получить")) {
    push(`/thanks?lang=ru`); // всё равно идём на страницу "Спасибо"
    return;
  }
  setError(msg);
}
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-16">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-slate-600">
          Сервис работает автоматически. Заполните поля — заказ поступит в работу. Далее оплатите через PayPal.Me.
        </p>
        {service === "audit-pro" && (
  <p className="mt-3 text-slate-600 text-sm">
    Глубокий анализ канала, ниши и SEO. Персональный план продвижения на 30 дней.
  </p>
)}

        <form className="mt-8 grid gap-4" onSubmit={onSubmit}>
          {/* системные */}
          <input type="hidden" name="service" value={service} />
          <input type="hidden" name="lang" value="ru" />
          <input type="hidden" name="price" value={price} />
          <input type="text" name="hp" style={{display:"none"}} tabIndex={-1} autoComplete="off" />

          {/* общие поля */}
          <input required name="email" type="email" placeholder="Ваш email" className="w-full rounded-xl border p-3" />
          <input required name="channel_url" placeholder="Ссылка на канал" className="w-full rounded-xl border p-3" />

          {/* по услуге */}
          {service === "audit" && (
          <input
          name="prompt"
          placeholder="Ваш вопрос/тема для Мемо-Shorts"
          className="w-full rounded-xl border p-3" />
          )}
          {service === "shorts" && (
            <input name="video_url" placeholder="Ссылка на исходное видео/текст/аудио" className="w-full rounded-xl border p-3" />
          )}
          {service === "video" && (
            <input name="video_url" placeholder="Ссылка на видео для правок" className="w-full rounded-xl border p-3" />
          )}
          {service === "branding" && (
            <input name="brand_note" placeholder="Пожелания к стилю (опционально)" className="w-full rounded-xl border p-3" />
          )}

          <textarea name="note" placeholder="Комментарий (опционально)" className="w-full rounded-xl border p-3 h-28" />

          <div className="flex items-center gap-3">
            <button disabled={loading} className="px-5 py-3 rounded-2xl bg-black text-white disabled:opacity-60">
              Отправить и оплатить
            </button>
            {paypal && Number(price) > 0 && (
  <a
    href={`${paypal}/${String(price).replace(/[^\d.]/g, "")}${CURRENCY_CODE}`}
    target="_blank"
    rel="noopener noreferrer"
    className="px-5 py-3 rounded-2xl border"
  >
    Оплатить отдельно
  </a>
)}

          </div>

          <p className="text-xs text-slate-500">
            В режиме старта оплата подтверждается вручную. После оплаты вы получите письмо-подтверждение от системы.
          </p>

          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
      </div>
    </section>
  );
}







