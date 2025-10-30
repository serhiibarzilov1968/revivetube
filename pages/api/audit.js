// pages/api/audit.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const { email, channel_url, lang = "ru" } = req.body || {};

    if (!email || !channel_url) {
      return res.status(400).send("Missing required fields");
    }

    // Подключение к почте
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: process.env.SMTP_SECURE === "true", // true для 465 (SSL)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Письмо тебе (на ops@revivetube.app)
    await transporter.sendMail({
      from: `ReviveTube System <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: `Новый заказ аудита — ${channel_url}`,
      text: `
Новая заявка на аудит YouTube-канала

Email клиента: ${email}
Ссылка на канал: ${channel_url}

Дата: ${new Date().toLocaleString("ru-RU")}
`,
    });

    // Автоответ клиенту
    const responseText =
      lang === "en"
        ? `Your request for a YouTube channel audit has been received. You'll get your report within 24 hours.\n\n— ReviveTube System`
        : `Ваша заявка на аудит канала принята. Отчёт будет готов в течение 24 часов.\n\n— Сервис ReviveTube`;

    await transporter.sendMail({
      from: `ReviveTube System <${process.env.SMTP_USER}>`,
      to: email,
      subject:
        lang === "en"
          ? "ReviveTube — audit request received"
          : "ReviveTube — заявка принята",
      text: responseText,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send("Mail error");
  }
}
