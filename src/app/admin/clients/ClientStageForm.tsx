"use client";

import { useActionState } from "react";
import {
  updateClientStageAction,
  type UpdateClientStageState,
} from "../actions";
import { CONSTRUCTION_STAGES } from "@/lib/construction-stages";

const initialState: UpdateClientStageState = {};

type Props = {
  clientId: string;
  currentStage: number;
};

export default function ClientStageForm({ clientId, currentStage }: Props) {
  const [state, formAction, pending] = useActionState(
    updateClientStageAction,
    initialState
  );

  return (
    <form action={formAction} className="mt-3 flex flex-wrap items-center gap-2">
      <input type="hidden" name="client_id" value={clientId} />
      <select
        name="current_stage"
        defaultValue={currentStage}
        className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 outline-none focus:border-amber-600"
      >
        {CONSTRUCTION_STAGES.map((s) => (
          <option key={s.id} value={s.id}>
            {s.id}. {s.title}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-amber-600 px-3 py-1.5 text-xs font-medium text-slate-950 hover:bg-amber-500 disabled:opacity-60"
      >
        {pending ? "Сохраняем..." : "Сохранить"}
      </button>
      {state.success && (
        <p className="text-xs font-medium text-emerald-400">Статус обновлён</p>
      )}
      {state.error && <p className="text-xs text-red-400">{state.error}</p>}
    </form>
  );
}
