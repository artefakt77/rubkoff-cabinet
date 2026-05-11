import type { PostgrestError } from "@supabase/supabase-js";

/** Подробный вывод ошибки PostgREST / Supabase в серверные логи */
export function logSupabaseError(context: string, error: PostgrestError): void {
  console.error(
    `[Supabase] ${context}`,
    JSON.stringify(
      {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      },
      null,
      2
    )
  );
}
