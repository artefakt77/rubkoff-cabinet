import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Клиент Supabase на сервере (страницы и Server Actions).
 * Читает и обновляет cookies сессии Supabase Auth (когда подключим вход).
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Задайте NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY в .env.local"
    );
  }
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          /* set может быть недоступен в Server Component без мутации — норм для чтения */
        }
      },
    },
  });
}
