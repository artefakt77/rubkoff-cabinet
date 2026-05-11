"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { logSupabaseError } from "@/lib/supabase/log-error";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service";

export type UploadPhotosState = {
  error?: string;
  success?: boolean;
  uploaded?: number;
};

const MAX_FILES = 20;
const MAX_BYTES = 15 * 1024 * 1024;

function sanitizeFileName(name: string): string {
  const base = name.split(/[/\\]/).pop() ?? "image";
  const cleaned = base.replace(/[^\w.-]+/g, "_").replace(/^\.+/, "");
  return (cleaned || "image").slice(0, 180);
}

function isAllowedImageType(mime: string): boolean {
  if (mime === "image/svg+xml") return false;
  return mime.startsWith("image/");
}

export async function uploadPhotosAction(
  _prev: UploadPhotosState,
  formData: FormData
): Promise<UploadPhotosState> {
  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) {
    console.error(
      "[uploadPhotos] SUPABASE_SERVICE_ROLE_KEY не задан — загрузка в Storage и INSERT в photos невозможны при RLS."
    );
    return {
      error:
        "Нет ключа SUPABASE_SERVICE_ROLE_KEY в .env.local — добавьте service_role из Supabase (Project Settings → API).",
    };
  }

  const clientId = (formData.get("client_id") as string | null)?.trim() ?? "";
  if (!clientId || !/^[0-9a-f-]{36}$/i.test(clientId)) {
    return { error: "Выберите клиента из списка." };
  }

  const captionRaw = (formData.get("caption") as string | null)?.trim();
  const caption = captionRaw ? captionRaw.slice(0, 2000) : null;

  const files = formData
    .getAll("files")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length === 0) {
    return { error: "Выберите хотя бы один файл с изображением." };
  }
  if (files.length > MAX_FILES) {
    return { error: `За один раз можно загрузить не больше ${MAX_FILES} файлов.` };
  }

  const { data: clientRow, error: clientErr } = await supabase
    .from("clients")
    .select("id")
    .eq("id", clientId)
    .maybeSingle();

  if (clientErr) {
    logSupabaseError("uploadPhotos client lookup", clientErr);
    return { error: "Не удалось проверить клиента в базе." };
  }
  if (!clientRow) {
    return { error: "Клиент не найден." };
  }

  let uploaded = 0;
  for (const file of files) {
    if (file.size > MAX_BYTES) {
      return {
        error: `Файл «${file.name}» слишком большой (максимум 15 МБ).`,
      };
    }
    if (!isAllowedImageType(file.type)) {
      return {
        error: `Файл «${file.name}» — не изображение или недопустимый тип.`,
      };
    }

    const objectPath = `${clientId}/${randomUUID()}_${sanitizeFileName(file.name)}`;
    const body = Buffer.from(await file.arrayBuffer());

    const { error: upErr } = await supabase.storage
      .from("photo")
      .upload(objectPath, body, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (upErr) {
      console.error(
        "[uploadPhotos] Storage upload failed:",
        JSON.stringify(
          {
            message: upErr.message,
            name: (upErr as Error).name,
            file: file.name,
            path: objectPath,
          },
          null,
          2
        )
      );
      return {
        error: `Не удалось загрузить «${file.name}» в Storage: ${upErr.message}. Проверьте, что bucket «photo» создан (см. supabase/schema.sql).`,
      };
    }

    const { data: pub } = supabase.storage.from("photo").getPublicUrl(objectPath);
    const url = pub.publicUrl;

    const { error: insErr } = await supabase.from("photos").insert({
      client_id: clientId,
      url,
      caption,
    });

    if (insErr) {
      logSupabaseError("uploadPhotos insert photos", insErr);
      return {
        error: `Файл «${file.name}» загружен в Storage, но не записался в таблицу photos (${insErr.code ?? "unknown"}). Выполните SQL из supabase/schema.sql. См. лог сервера.`,
      };
    }
    uploaded += 1;
  }

  revalidatePath("/admin/photo");
  revalidatePath("/cabinet");
  revalidatePath("/cabinet/photos");
  return { success: true, uploaded };
}
