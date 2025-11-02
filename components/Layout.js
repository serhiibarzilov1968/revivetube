import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold">ReviveTube</Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/services">Услуги</Link>
            <Link href="/audit?lang=ru">Аудит</Link>
            <Link href="/audit?lang=en">Audit (EN)</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t">
        <div className="max-w-5xl mx-auto px-4 py-6 text-sm text-slate-500">
          © {new Date().getFullYear()} ReviveTube
        </div>
      </footer>
    </div>
  );
}
