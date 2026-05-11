import { getServerSupabaseForData } from "@/lib/supabase/data-client";
import PhotoUploadForm, { type ClientOption } from "./PhotoUploadForm";

export const dynamic = "force-dynamic";

export default async function AdminPhotoPage() {
  const supabase = await getServerSupabaseForData();
  const { data: rows, error } = await supabase
    .from("clients")
    .select("id, full_name, contract_number")
    .order("full_name", { ascending: true });

  if (error) {
    console.error(
      "[admin/photo] clients list:",
      JSON.stringify(
        { message: error.message, code: error.code, details: error.details },
        null,
        2
      )
    );
  }

  const clients: ClientOption[] = (rows ?? []).map((r) => ({
    id: r.id,
    full_name: r.full_name,
    contract_number: r.contract_number,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Фото объектов</h1>
        <p className="mt-1 text-sm text-slate-400">
          Загрузка в Supabase Storage и сохранение ссылки в таблице{" "}
          <code className="rounded bg-slate-800 px-1">photos</code>.
        </p>
      </div>

      <PhotoUploadForm clients={clients} />
    </div>
  );
}
