import { useRouter } from "next/router";

export default function Thanks() {
  const { query } = useRouter();
  const lang = query.lang || "ru";
  const text = lang === "en"
    ? { h: "Thank you!", p: "Your audit request has been received. We will send the report to your email." }
    : { h: "Спасибо!", p: "Заявка на аудит получена. Мы отправим отчёт на ваш email." };
  return (
    <section className="py-16">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold">{text.h}</h1>
        <p className="mt-2 text-slate-600">{text.p}</p>
      </div>
    </section>
  );
}
