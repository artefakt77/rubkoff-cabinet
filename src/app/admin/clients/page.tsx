import { getServerSupabaseForData } from "@/lib/supabase/data-client";
import { getStageTitle } from "@/lib/construction-stages";
import AddClientForm from "./AddClientForm";
import ClientStageForm from "./ClientStageForm";

export const dynamic = "force-dynamic";

export default async function AdminClientsPage() {
  const supabase = await getServerSupabaseForData();
  const { data: clients } = await supabase
    .from("clients")
    .select(
      "id, full_name, contract_number, object_address, current_stage, manager_name"
    )
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Клиенты</h1>
        <p className="mt-1 text-sm text-slate-400">
          Добавляйте клиентов — они смогут войти в кабинет по договору и телефону.
        </p>
      </div>

      <AddClientForm />

      <section>
        <h2 className="mb-3 text-base font-semibold text-slate-200">
          Все клиенты ({clients?.length ?? 0})
        </h2>
        {clients && clients.length > 0 ? (
          <ul className="space-y-2">
            {clients.map((c) => (
              <li
                key={c.id}
                className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-slate-100">{c.full_name}</p>
                    <p className="text-sm text-slate-400">
                      Договор: {c.contract_number}
                    </p>
                    <p className="text-sm text-slate-400">{c.object_address}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-amber-600/20 px-2 py-0.5 text-xs font-medium text-amber-400">
                    Этап {c.current_stage} — {getStageTitle(c.current_stage)}
                  </span>
                </div>
                {c.manager_name && (
                  <p className="mt-1 text-xs text-slate-500">
                    Менеджер: {c.manager_name}
                  </p>
                )}
                <ClientStageForm clientId={c.id} currentStage={c.current_stage} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">Клиентов пока нет.</p>
        )}
      </section>
    </div>
  );
}
