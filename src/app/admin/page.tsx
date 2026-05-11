import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Обзор</h1>
      <p className="text-sm text-slate-400">
        Здесь будет сводка: активные объекты, последние загрузки. Сейчас —
        каркас разделов.
      </p>
      <ul className="grid gap-3 sm:grid-cols-2">
        <li>
          <Link
            href="/admin/clients"
            className="block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-amber-600/50"
          >
            <span className="font-medium text-amber-400">Клиенты</span>
            <p className="mt-1 text-sm text-slate-400">
              Добавить клиента, сменить этап
            </p>
          </Link>
        </li>
        <li>
          <Link
            href="/admin/photo"
            className="block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-amber-600/50"
          >
            <span className="font-medium text-amber-400">Фото</span>
            <p className="mt-1 text-sm text-slate-400">
              Загрузка фото по объекту
            </p>
          </Link>
        </li>
      </ul>
    </div>
  );
}
