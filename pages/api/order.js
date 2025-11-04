// pages/api/order.js
import nodemailer from "nodemailer";

const CURRENCY_SIGN = process.env.NEXT_PUBLIC_CURRENCY_SIGN || "$";
const CURRENCY_CODE = process.env.NEXT_PUBLIC_CURRENCY_CODE || "USD";
const fmt = (p) => `${CURRENCY_SIGN}${Number(p || 0).toFixed(2)} ${CURRENCY_CODE}`;

const TITLES = {
  // Базовые
  audit: "Мемо-Shorts (ИИ-памятка)",          // бывший "Аудит канала"
  "audit-pro": "Развёрнутый аудит (30 дней)",
  "memo-shorts": "Мемо-Shorts (ИИ-памятка)",
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

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
  try {
    // добавили prompt
    const {
      service = "audit",
      email,
      channel_url,
      video_url = "",
      brand_note = "",
      note = "",
      lang = "ru",
      price = "",
      hp = "",
      prompt = ""
    } = req.body || {};

    // honeypot
    if (hp) return res.status(200).send("OK");
    if (!email || !channel_url) return res.status(400).send("Missing required fields");

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: String(process.env.SMTP_SECURE || "true") === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const title = TITLES[service] || service;
    const now = new Date().toISOString();

    // Письмо в ops
    await transporter.sendMail({
      from: `ReviveTube System <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: `ORDER: ${title} — ${channel_url}`,
      text: `SERVICE: ${service}
TITLE: ${title}
PRICE: ${fmt(price)}
EMAIL: ${email}
CHANNEL: ${channel_url}
VIDEO: ${video_url}
PROMPT: ${prompt}
BRAND_NOTE: ${brand_note}
NOTE: ${note}
TIME: ${now}
STATUS: PENDING_PAYMENT`,
    });

    // Автоответ клиенту
    await transporter.sendMail({
      from: `ReviveTube System <${process.env.SMTP_USER}>`,
      to: email,
      subject: `ReviveTube — заявка принята: ${title}`,
      text: `Ваша заявка принята автоматическим сервисом ReviveTube.
Услуга: ${title}
Стоимость: ${fmt(price)}
Канал: ${channel_url}

Если услуга платная — оплатите, пожалуйста, по ссылке на странице заказа.
После оплаты вы получите подтверждение от системы.`,
      replyTo: process.env.SMTP_USER,
    });

    // --- Отправка в Google Sheets через Make.com webhook ---
    try {
      if (process.env.GSHEET_WEBHOOK_URL) {
        const headers = { "Content-Type": "application/json" };
        // если хочешь простой секрет-ключ — добавь в Vercel WEBHOOK_KEY и раскомментируй:
        // if (process.env.WEBHOOK_KEY) headers["X-RT-Key"] = process.env.WEBHOOK_KEY;

        await fetch(process.env.GSHEET_WEBHOOK_URL, {
          method: "POST",
          headers,
          body: JSON.stringify({
            timestamp: now,
            service, price, email, channel_url, video_url, brand_note, note, prompt,
            status: "NEW",
          }),
        });
      }
    } catch (e) {
      console.error("GSHEET webhook failed:", e);
    }

    // Редирект на спасибо
    const base = process.env.NEXT_PUBLIC_SITE_URL || "";
    const thanks = base ? `${base}/thanks?lang=${lang}` : `/thanks?lang=${lang}`;
    res.setHeader("Location", thanks);
    return res.status(303).end();
  } catch (e) {
    console.error(e);
    return res.status(500).send("Mail error");
  }
}


