import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServerSupabaseForData } from "@/lib/supabase/data-client";
import { groupPhotosByWeek } from "@/lib/group-photos-by-week";
import type { PhotoRow } from "@/types/cabinet";

export default async function CabinetPhotosPage() {
  const cookieStore = await cookies();
  const clientId = cookieStore.get("client_id")?.value;
  if (!clientId) redirect("/login");

  const supabase = await getServerSupabaseForData();
  const { data: rows } = await supabase
    .from("photos")
    .select("id, client_id, url, caption, uploaded_at")
    .eq("client_id", clientId)
    .order("uploaded_at", { ascending: false });

  const photos: PhotoRow[] = (rows ?? []) as PhotoRow[];
  const weeks = groupPhotosByWeek(photos);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-stone-900">Фото хода работ</h1>
      <p className="text-sm text-stone-600">
        Снимки сгруппированы по неделям (по дате загрузки).
      </p>

      {weeks.length === 0 ? (
        <p className="text-sm text-stone-500">Пока нет загруженных фото.</p>
      ) : (
        <div className="space-y-8">
          {weeks.map((w) => (
            <section key={w.label}>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
                {w.label}
              </h2>
              <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {w.photos.map((p) => (
                  <li
                    key={p.id}
                    className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm"
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
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
