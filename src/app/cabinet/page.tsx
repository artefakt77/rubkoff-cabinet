import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServerSupabaseForData } from "@/lib/supabase/data-client";
import { getStageTitle } from "@/lib/construction-stages";
import type { ClientProfile, PhotoRow } from "@/types/cabinet";

export default async function CabinetHomePage() {
  const cookieStore = await cookies();
  const clientId = cookieStore.get("client_id")?.value;

  if (!clientId) {
    redirect("/login");
  }

  const supabase = await getServerSupabaseForData();
  const { data: client, error } = await supabase
    .from("clients")
    .select(
      "id, contract_number, full_name, object_address, current_stage, manager_name, manager_phone"
    )
    .eq("id", clientId)
    .maybeSingle<ClientProfile>();

  if (error || !client) {
    redirect("/login");
  }

  const { data: photoRows } = await supabase
    .from("photos")
    .select("id, client_id, url, caption, uploaded_at")
    .eq("client_id", clientId)
    .order("uploaded_at", { ascending: false })
    .limit(9);

  const latestPhotos: PhotoRow[] = (photoRows ?? []) as PhotoRow[];

  const stage = client.current_stage;

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-semibold text-stone-900">
          Здравствуйте, {client.full_name}
        </h1>
        <p className="mt-1 text-stone-600">
          Объект:{" "}
          <span className="font-medium text-stone-800">
            {client.object_address}
          </span>
        </p>
        <p className="mt-0.5 text-sm text-stone-500">
          Договор № {client.contract_number}
        </p>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-medium uppercase tracking-wide text-stone-500">
          Текущий этап
        </h2>
        <p className="mt-2 text-lg font-semibold text-stone-900">
          Этап {stage} из 8 — {getStageTitle(stage)}
        </p>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-stone-100">
          <div
            className="h-full rounded-full bg-amber-600 transition-all"
            style={{ width: `${(stage / 8) * 100}%` }}
          />
        </div>
        <ol className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-stone-500 sm:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
            <li
              key={n}
              className={n === stage ? "font-semibold text-amber-700" : ""}
            >
              {n}. {getStageTitle(n)}
            </li>
          ))}
        </ol>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-900">Последние фото</h2>
          <a
            href="/cabinet/photos"
            className="text-sm font-medium text-amber-800 hover:underline"
          >
            Все фото
          </a>
        </div>
        {latestPhotos.length === 0 ? (
          <p className="mt-2 text-sm text-stone-500">
            Фото появятся после загрузки в разделе админки «Фото».
          </p>
        ) : (
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {latestPhotos.map((p) => (
              <li
                key={p.id}
                className="overflow-hidden rounded-lg border border-stone-200 bg-stone-100 shadow-sm"
              >
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={p.url}
                    alt={p.caption ?? "Фото объекта"}
                    className="aspect-[4/3] w-full object-cover"
                    loading="lazy"
                  />
                </a>
                {p.caption && (
                  <p className="line-clamp-2 px-2 py-1.5 text-xs text-stone-600">
                    {p.caption}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {(client.manager_name || client.manager_phone) && (
        <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium uppercase tracking-wide text-stone-500">
            Ваш менеджер
          </h2>
          {client.manager_name && (
            <p className="mt-2 font-medium text-stone-900">
              {client.manager_name}
            </p>
          )}
          {client.manager_phone && (
            <p className="text-stone-600">
              <a
                href={`tel:${client.manager_phone}`}
                className="text-amber-800 hover:underline"
              >
                {client.manager_phone}
              </a>
            </p>
          )}
        </section>
      )}
    </div>
  );
}
