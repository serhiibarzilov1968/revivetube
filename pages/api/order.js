import nodemailer from "nodemailer";

const TITLES = {
  "memo-shorts": "Мемо-Shorts (ИИ-памятка)",
  "audit-pro": "Развёрнутый аудит (30 дней)",
  branding: "Оформление канала",
  "seo-fix": "SEO-правки канала",
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

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
  try {
    // ВАЖНО: добавили prompt в распаковку, и дефолты оставили как были
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
      prompt = "" // <-- вот оно: вопрос/тема для Мемо-Shorts
    } = req.body || {};

    // простой honeypot
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

    // Уведомление в ops
    await transporter.sendMail({
      from: `ReviveTube System <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: `ORDER: ${title} — ${channel_url}`,
      text: `SERVICE: ${service}
TITLE: ${title}
PRICE: ${price} €
EMAIL: ${email}
CHANNEL: ${channel_url}
VIDEO: ${video_url}
PROMPT: ${prompt}        // <-- добавили вывод вопроса/темы
BRAND_NOTE: ${brand_note}
NOTE: ${note}
TIME: ${now}
STATUS: PENDING_PAYMENT`,
    });

    // Автоответ клиенту (без изменений в логике)
    await transporter.sendMail({
      from: `ReviveTube System <${process.env.SMTP_USER}>`,
      to: email,
      subject: `ReviveTube — заявка принята: ${title}`,
      text: `Ваша заявка принята автоматическим сервисом ReviveTube.
Услуга: ${title}
Стоимость: ${price} €
Канал: ${channel_url}

Если услуга платная — оплатите, пожалуйста, по ссылке на странице заказа.
После оплаты вы получите подтверждение от системы.`,
      replyTo: process.env.SMTP_USER,
    });

    // (Опционально) запись в Google Таблицу через Apps Script Web App
    try {
      if (process.env.GSHEET_WEBAPP_URL) {
        await fetch(process.env.GSHEET_WEBAPP_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service, price, email, channel_url, video_url, brand_note, note, prompt
          }),
        });
      }
    } catch (e) {
      console.error("GSHEET append failed:", e);
    }

    const base = process.env.NEXT_PUBLIC_SITE_URL || "";
    const thanks = base ? `${base}/thanks?lang=${lang}` : `/thanks?lang=${lang}`;
    res.setHeader("Location", thanks);
    return res.status(303).end();
  } catch (e) {
    console.error(e);
    return res.status(500).send("Mail error");
  }
}
