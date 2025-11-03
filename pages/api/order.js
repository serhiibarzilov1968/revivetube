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
    const {
      service = "audit",
      email,
      channel_url,
      video_url = "",
      brand_note = "",
      note = "",
      lang = "ru",
      price = "",
      hp = ""
    } = req.body || {};

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
PRICE: ${price} €
EMAIL: ${email}
CHANNEL: ${channel_url}
VIDEO: ${video_url}
BRAND_NOTE: ${brand_note}
NOTE: ${note}
TIME: ${now}
STATUS: PENDING_PAYMENT (PayPal.Me)`,
    });

    // Автоответ клиенту
    await transporter.sendMail({
      from: `ReviveTube System <${process.env.SMTP_USER}>`,
      to: email,
      subject: `ReviveTube — заявка принята: ${title}`,
      text: `Ваша заявка принята автоматическим сервисом ReviveTube.
Услуга: ${title}
Стоимость: ${price} €
Канал: ${channel_url}

Оплатите, пожалуйста, по ссылке PayPal.Me на странице заказа.
После оплаты вы получите подтверждение от системы.`,
      replyTo: process.env.SMTP_USER,
    });

    const base = process.env.NEXT_PUBLIC_SITE_URL || "";
    const thanks = base ? `${base}/thanks?lang=${lang}` : `/thanks?lang=${lang}`;
    res.setHeader("Location", thanks);
    return res.status(303).end();
  } catch (e) {
    console.error(e);
    return res.status(500).send("Mail error");
  }
}


