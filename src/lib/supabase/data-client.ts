import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Для серверных чтений: при наличии service_role обходит RLS (нужно при включённом RLS без политик для anon).
 */
export async function getServerSupabaseForData(): Promise<SupabaseClient> {
  const service = createServiceRoleSupabaseClient();
  if (service) return service;
  return createServerSupabaseClient();
}
