// pages/audit.js
import Layout from "../components/Layout";
import { useRouter } from "next/router";

export default function Audit() {
  const { query } = useRouter();
  const lang = (query.lang || "ru");

  const t = {
    ru: {
      h1: "Аудит канала",
      p: "Автоматический анализ: ошибки, приоритеты и план на 7 дней. Результат придёт на ваш email.",
      form: {
        email: "Ваш email",
        url: "Ссылка на канал",
        niche: "Язык/ниша (опционально)",
        goal: "Цель: рост, лиды, монетизация... (опционально)",
        submit: "Отправить запрос",
      },
      note: "Режим по умолчанию — Self-Serve. Если захотите, мы применим правки за вас на следующем шаге."
    },
    en: {
      h1: "Channel Audit",
      p: "Automatic analysis: issues, priorities and a 7-day plan. The result will be sent to your email.",
      form: {
        email: "Your email",
        url: "Channel URL",
        niche: "Language/Niche (optional)",
        goal: "Goal: growth, leads, monetization... (optional)",
        submit: "Submit request",
      },
      note: "Default mode — Self-Serve. If you wish, we can apply changes for you in the next step."
    }
  }[lang];

  return (
    <Layout>
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-bold">{t.h1}</h1>
          <p className="mt-2 text-slate-600">{t.p}</p>

          {/* Без FormSubmit — отправляем в собственный API-роут */}
          <form className="mt-8 grid gap-4" action="/api/audit" method="POST">
            {/* язык интерфейса (для текста автоответа) */}
            <input type="hidden" name="lang" value={lang} />
            {/* honeypot от ботов (пустое скрытое поле) */}
            <input type="text" name="hp" style={{ display: "none" }} tabIndex="-1" autoComplete="off" />

            <input required name="email" type="email" placeholder={t.form.email} className="w-full rounded-xl border p-3" />
            <input required name="channel_url" placeholder={t.form.url} className="w-full rounded-xl border p-3" />
            <input name="niche" placeholder={t.form.niche} className="w-full rounded-xl border p-3" />
            <input name="goal" pl
