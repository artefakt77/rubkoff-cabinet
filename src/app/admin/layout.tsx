import Link from "next/link";

/** Простая админка: отдельный макет и ссылки на разделы */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              ГК Рубкофф
            </p>
            <p className="text-sm font-semibold">Админка кабинета</p>
          </div>
          <nav className="flex flex-wrap gap-2 text-sm">
            <Link
              href="/admin"
              className="rounded-md px-2 py-1 text-slate-200 hover:bg-slate-800"
            >
              Обзор
            </Link>
            <Link
              href="/admin/clients"
              className="rounded-md px-2 py-1 text-slate-200 hover:bg-slate-800"
            >
              Клиенты
            </Link>
            <Link
              href="/admin/photo"
              className="rounded-md px-2 py-1 text-slate-200 hover:bg-slate-800"
            >
              Фото
            </Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-4xl px-4 py-8">{children}</div>
    </div>
  );
}
