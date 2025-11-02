import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
  try {
    const body = req.body || {};
    const { email, channel_url, niche = "", goal = "", lang = "ru", hp = "" } = body;
    if (hp) return res.status(200).send("OK");

    if (!email || !channel_url) return res.status(400).send("Missing required fields");

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: String(process.env.SMTP_SECURE || "true") === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: `ReviveTube System <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: `Audit Request — ${channel_url}`,
      text: `NEW AUDIT REQUEST
Email: ${email}
Channel: ${channel_url}
Niche/Language: ${niche}
Goal: ${goal}
Time: ${new Date().toISOString()}`,
    });

    const subj = lang === "en" ? "ReviveTube — audit request received" : "ReviveTube — заявка принята";
    const txt = lang === "en"
      ? `Your channel audit request has been received. You'll get the report within 24 hours.
Channel: ${channel_url}
— ReviveTube System`
      : `Ваша заявка на аудит канала принята. Отчёт придёт в течение 24 часов.
Канал: ${channel_url}
— Сервис ReviveTube`;

    await transporter.sendMail({
      from: `ReviveTube System <${process.env.SMTP_USER}>`,
      to: email,
      subject: subj,
      text: txt,
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
