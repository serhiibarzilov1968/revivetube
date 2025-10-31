import "../styles/globals.css";
import Layout from "../components/Layout";

export default function Thanks() {
  const { query } = useRouter();
  const lang = (query.lang || "ru");

  const t = {
    ru: {
      h1: "Заявка получена",
      p: "ReviveTube System начал обработку. Отчёт придёт на ваш email в течение 24 часов.",
      back: "На главную"
    },
    en: {
      h1: "Request received",
      p: "ReviveTube System has started processing. You'll get the report by email within 24 hours.",
      back: "Back to Home"
    }
  }[lang];

  return (
    <Layout>
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-bold">{t.h1}</h1>
          <p className="mt-2 text-slate-600">{t.p}</p>
          <div className="mt-6">
            <Link href={{ pathname: "/", query: { lang } }} className="px-4 py-2 rounded-xl border">{t.back}</Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
