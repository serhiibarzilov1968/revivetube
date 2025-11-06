// pages/order.js
import { useRouter } from "next/router";
import { useState } from "react";

// Валюта/PayPal — можно задать через Vercel → Environment Variables
const CURRENCY_CODE =
  process.env.NEXT_PUBLIC_CURRENCY_CODE || "USD";
const CURRENCY_SIGN =
  process.env.NEXT_PUBLIC_CURRENCY_SIGN || "$";
const PAYPAL_ME =
  process.env.NEXT_PUBLIC_PAYPAL_ME || ""; // например: https://paypal.me/yourname

// Человекочитаемые названия услуг
const NAMES = {
  audit: "Мемо-Shorts (ИИ-памятка)",
  "memo-shorts": "Мемо-Shorts (ИИ-памятка)",
  "audit-pro": "Развёрнутый аудит (30 дней)",
  shorts: "Шортс из вашего контента",
  video: "Работа с видео",
  manager: "Ведение (менеджер)",
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

export default function OrderPage() {
  const { query, push } = useRouter();
  const service = String(query.service || "audit");
  const price = Number(query.price || 0);
  const lang = String(query.lang || "ru");
  const title = NAMES[service] || service;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // собираем поля формы
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    // страхуемся: пробрасываем ключи service/price/lang
    data.service = service;
    data.price = price;
    data.lang = lang;

    try {
      const r = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // открываем PayPal в новой вкладке (если есть цена и задан PayPal.Me)
      if (PAYPAL_ME && Number(price) > 0) {
        const numeric = String(price).replace(/[^\d.]/g, "");
        const payUrl = `${PAYPAL_ME}/${numeric}${CURRENCY_CODE}`; // фиксируем валюту USD
        window.open(payUrl, "_blank");
      }

      // успешный ответ сервера
      if (r.ok) {
        push(`/thanks?lang=${lang}`);
      } else {
        const txt = await r.text();
        setError(txt || "Ошибка отправки");
      }
    } catch (e) {
      // типичная ситуация: браузер оборвал fetch из-за открытия вкладки/редиректа
      const msg = String(e || "");
      if (msg.includes("Failed to fetch") || msg.includes("Не удалось получить")) {
        push(`/thanks?lang=${lang}`);
        return;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  // показывать поле prompt для Мемо-Shorts
  const showPrompt = service === "audit" || service === "memo-shorts";

  return (
    
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-bold">{title}</h1>

          <div className="mt-2 text-slate-600">
            {price > 0 ? (
              <span>
                Стоимость:{" "}
                <strong>
                  {CURRENCY_SIGN}
                  {price.toFixed(2)} {CURRENCY_CODE}
                </strong>
              </span>
            ) : (
              <span>Услуга оформляется без предоплаты.</span>
            )}
          </div>

          <form className="mt-8 grid gap-4" onSubmit={onSubmit}>
            {/* служебные поля */}
            <input type="hidden" name="service" value={service} />
            <input type="hidden" name="price" value={price} />
            <input type="hidden" name="lang" value={lang} />
            {/* honeypot */}
            <input
              type="text"
              name="hp"
              style={{ display: "none" }}
              tabIndex={-1}
              autoComplete="off"
            />

            <input
              required
              name="email"
              type="email"
              placeholder="Ваш email"
              className="w-full rounded-xl border p-3"
            />

            <input
              required
              name="channel_url"
              placeholder="Ссылка на канал"
              className="w-full rounded-xl border p-3"
            />

            {/* опциональные поля */}
            <input
              name="video_url"
              placeholder="Ссылка на видео (если нужно)"
              className="w-full rounded-xl border p-3"
            />

            {showPrompt && (
              <input
                name="prompt"
                placeholder="Ваш вопрос/тема для Мемо-Shorts"
                className="w-full rounded-xl border p-3"
              />
            )}

            <textarea
              name="brand_note"
              placeholder="Пожелания по стилю/бренду (опционально)"
              className="w-full rounded-xl border p-3"
              rows={3}
            />

            <textarea
              name="note"
              placeholder="Комментарий (опционально)"
              className="w-full rounded-xl border p-3"
              rows={3}
            />

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-3 rounded-2xl bg-black text-white disabled:opacity-50"
              >
                {loading ? "Отправка…" : "Оформить заказ"}
              </button>

              {PAYPAL_ME && price > 0 && (
                <a
                  className="px-5 py-3 rounded-2xl border"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`${PAYPAL_ME}/${String(price).replace(/[^\d.]/g, "")}${CURRENCY_CODE}`}
                >
                  Оплатить отдельно
                </a>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-600">
                {String(error)}
              </p>
            )}
          </form>
        </div>
      </section>
    
  );
}

