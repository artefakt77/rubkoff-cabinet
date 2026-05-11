import type { PhotoRow } from "@/types/cabinet";

/** Понедельник 00:00 локального времени для календарной недели */
function mondayOfWeek(d: Date): Date {
  const copy = new Date(d);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function formatWeekRangeRu(monday: Date, sunday: Date): string {
  const opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const a = monday.toLocaleDateString("ru-RU", opts);
  const b = sunday.toLocaleDateString("ru-RU", opts);
  return `${a} — ${b}`;
}

export type PhotoWeekGroup = {
  label: string;
  photos: PhotoRow[];
};

/** Группировка по календарной неделе (пн–вс), новые недели сверху */
export function groupPhotosByWeek(photos: PhotoRow[]): PhotoWeekGroup[] {
  const map = new Map<string, { monday: Date; items: PhotoRow[] }>();

  for (const p of photos) {
    const uploaded = new Date(p.uploaded_at);
    const monday = mondayOfWeek(uploaded);
    const key = monday.toISOString().slice(0, 10);
    let bucket = map.get(key);
    if (!bucket) {
      bucket = { monday, items: [] };
      map.set(key, bucket);
    }
    bucket.items.push(p);
  }

  const groups = [...map.values()].sort(
    (a, b) => b.monday.getTime() - a.monday.getTime()
  );

  return groups.map(({ monday, items }) => {
    const sunday = addDays(monday, 6);
    items.sort(
      (a, b) =>
        new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
    );
    return {
      label: formatWeekRangeRu(monday, sunday),
      photos: items,
    };
  });
}
