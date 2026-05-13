"use server";

import { revalidatePath } from "next/cache";
import { normalizePhone } from "@/lib/normalize-phone";
import { logSupabaseError } from "@/lib/supabase/log-error";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service";

export type AddClientState = {
  error?: string;
  success?: boolean;
};

export type UpdateClientStageState = {
  error?: string;
  success?: boolean;
};

export async function addClientAction(
  _prev: AddClientState,
  formData: FormData
): Promise<AddClientState> {
  const full_name = (formData.get("full_name") as string | null)?.trim() ?? "";
  const contract_number =
    (formData.get("contract_number") as string | null)?.trim() ?? "";
  const phone = (formData.get("phone") as string | null)?.trim() ?? "";
  const object_address =
    (formData.get("object_address") as string | null)?.trim() ?? "";
  const manager_name =
    (formData.get("manager_name") as string | null)?.trim() || null;
  const manager_phone =
    (formData.get("manager_phone") as string | null)?.trim() || null;
  const rawStage = Number(formData.get("current_stage") ?? 1);
  const current_stage =
    Number.isInteger(rawStage) && rawStage >= 1 && rawStage <= 8 ? rawStage : 1;

  if (!full_name || !contract_number || !phone || !object_address) {
    return { error: "Заполните обязательные поля: ФИО, договор, телефон, адрес." };
  }

  const phone_normalized = normalizePhone(phone);

  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) {
    console.error(
      "[addClient] SUPABASE_SERVICE_ROLE_KEY не задан. " +
        "С ключом anon INSERT часто блокируется RLS. " +
        "Добавьте service_role в .env.local (Supabase → Project Settings → API)."
    );
    return {
      error:
        "Сервер не настроен: добавьте SUPABASE_SERVICE_ROLE_KEY в .env.local (ключ service_role в панели Supabase). Без него запись в таблицу при включённом RLS невозможна.",
    };
  }

  const { error } = await supabase.from("clients").insert({
    full_name,
    contract_number,
    phone_normalized,
    object_address,
    manager_name,
    manager_phone,
    current_stage,
  });

  if (error) {
    logSupabaseError("addClient insert", error);
    if (error.code === "23505") {
      return { error: "Клиент с таким номером договора уже существует." };
    }
    if (error.code === "PGRST204" || error.message?.includes("schema cache")) {
      return {
        error:
          "Колонка не найдена в таблице clients — проверьте схему в Supabase (см. supabase/schema.sql). Подробности в логе сервера.",
      };
    }
    return {
      error: `Ошибка сохранения (${error.code ?? "unknown"}). Подробности в консоли сервера.`,
    };
  }

  revalidatePath("/admin/clients");
  return { success: true };
}

export async function updateClientStageAction(
  _prev: UpdateClientStageState,
  formData: FormData
): Promise<UpdateClientStageState> {
  const clientId = (formData.get("client_id") as string | null)?.trim() ?? "";
  const rawStage = Number(formData.get("current_stage") ?? 1);
  const current_stage =
    Number.isInteger(rawStage) && rawStage >= 1 && rawStage <= 8 ? rawStage : NaN;

  if (!clientId) {
    return { error: "Клиент не найден." };
  }
  if (Number.isNaN(current_stage)) {
    return { error: "Выберите корректный этап от 1 до 8." };
  }

  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) {
    console.error(
      "[updateClientStage] SUPABASE_SERVICE_ROLE_KEY не задан. " +
        "Обновление clients.current_stage невозможно при включённом RLS."
    );
    return {
      error:
        "Сервер не настроен: добавьте SUPABASE_SERVICE_ROLE_KEY в .env.local.",
    };
  }

  const { error } = await supabase
    .from("clients")
    .update({ current_stage })
    .eq("id", clientId);

  if (error) {
    logSupabaseError("updateClientStage update", error);
    return {
      error: `Не удалось обновить этап (${error.code ?? "unknown"}).`,
    };
  }

  revalidatePath("/admin/clients");
  revalidatePath("/cabinet");
  return { success: true };
}
