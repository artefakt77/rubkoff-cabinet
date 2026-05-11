import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Клиент с правами service_role — только на сервере (Server Actions, RSC).
 * Обходит RLS; ключ нельзя префиксом NEXT_PUBLIC_ и нельзя импортировать в клиентские компоненты.
 */
export function createServiceRoleSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
