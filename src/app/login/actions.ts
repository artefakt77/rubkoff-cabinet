"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getServerSupabaseForData } from "@/lib/supabase/data-client";
import { logSupabaseError } from "@/lib/supabase/log-error";
import { normalizePhone } from "@/lib/normalize-phone";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const contract = (formData.get("contract") as string | null)?.trim() ?? "";
  const phone = (formData.get("phone") as string | null)?.trim() ?? "";

  if (!contract || !phone) {
    return { error: "Введите номер договора и телефон." };
  }

  const phoneNorm = normalizePhone(phone);

  const supabase = await getServerSupabaseForData();
  const { data, error } = await supabase
    .from("clients")
    .select("id")
    .eq("contract_number", contract)
    .eq("phone_normalized", phoneNorm)
    .maybeSingle();

  if (error) {
    logSupabaseError("login select", error);
    return { error: "Ошибка сервера. Попробуйте ещё раз." };
  }

  if (!data) {
    return { error: "Клиент не найден. Проверьте номер договора и телефон." };
  }

  const cookieStore = await cookies();
  cookieStore.set("client_id", data.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 дней
  });

  redirect("/cabinet");
}
