import Link from "next/link";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const router = useRouter();
  const lang = (router.query.lang || "ru");

  const t = {
    ru: {
      brand: "ReviveTube",
      audit: "Аудит канала",
      home: "Главная",
      switch: "EN",
      footer: "© " + new Date().getFullYear() + " ReviveTube System",
    },
    en: {
      brand: "ReviveTube",
      audit: "Channel Audit",
      home: "Home",
      switch: "RU",
      footer: "© " + new Date().getFullYear() + " ReviveTube System",
    }
  }[lang];

  const switchLang = lang === "ru" ? "en" : "ru";
  const asPath = router.asPath.split('?')[0];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="border-b sticky top-0 bg-white/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center text-sm font-bold">RT</div>
            <Link href={{ pathname: "/", query: { lang } }} className="font-semibold">{t.brand}</Link>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link href={{ pathname: "/", query: { lang } }} className="hover:opacity-70">{t.home}</Link>
            <Link href={{ pathname: "/audit", query: { lang } }} className="hover:opacity-70">{t.audit}</Link>
            <Link href={{ pathname: asPath, query: { lang: switchLang } }} className="px-3 py-1.5 rounded-xl border">{t.switch}</Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t">
        <div className="max-w-5xl mx-auto px-4 py-8 text-sm text-slate-500">{t.footer}</div>
      </footer>
    </div>
  );
}
