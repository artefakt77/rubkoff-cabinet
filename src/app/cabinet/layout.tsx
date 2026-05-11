import Link from "next/link";

/** Общая «оболочка» кабинета: шапка и навигация между разделами */
export default function CabinetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              ГК Рубкофф
            </p>
            <p className="text-sm font-semibold text-stone-900">Личный кабинет</p>
          </div>
          <nav className="flex gap-3 text-sm">
            <Link
              href="/cabinet"
              className="rounded-md px-2 py-1 text-stone-700 hover:bg-stone-100"
            >
              Главная
            </Link>
            <Link
              href="/cabinet/photos"
              className="rounded-md px-2 py-1 text-stone-700 hover:bg-stone-100"
            >
              Все фото
            </Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-4 py-8">{children}</div>
    </div>
  );
}
