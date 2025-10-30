import Layout from "@/components/Layout";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Home() {
  const { query } = useRouter();
  const lang = (query.lang || "ru");

  const t = {
    ru: {
      h1: "Автоматический сервис для оживления YouTube‑каналов",
      p: "Нажми одну кнопку — получи отчёт об ошибках и план на 7 дней. Без созвонов, без разговоров.",
      cta: "Аудит канала (бесплатно)",
      stats: [
        ["≤ 24 часов", "Время подготовки"],
        ["PDF / online", "Формат отчёта"],
        ["Self‑Serve", "Режим по умолчанию"],
      ]
    },
    en: {
      h1: "Automatic service to revive YouTube channels",
      p: "Press one button — get a report and a 7‑day plan. No calls, no meetings.",
      cta: "Channel Audit (free)",
      stats: [
        ["≤ 24h", "Turnaround"],
        ["PDF / online", "Report format"],
        ["Self‑Serve", "Default mode"],
      ]
    }
  }[lang];

  return (
    <Layout>
      <section className="bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-5xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">{t.h1}</h1>
            <p className="mt-4 text-lg text-slate-600">{t.p}</p>
            <div className="mt-6">
              <Link href={{ pathname: "/audit", query: { lang } }} className="px-5 py-3 rounded-2xl bg-black text-white">{t.cta}</Link>
            </div>
          </div>
          <div className="rounded-3xl border p-6 bg-white">
            <div className="grid grid-cols-3 gap-3 text-center">
              {t.stats.map((s, i) => (
                <div key={i} className="rounded-2xl border p-4">
                  <div className="text-xl font-bold">{s[0]}</div>
                  <div className="text-xs text-slate-500">{s[1]}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              ReviveTube System
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
