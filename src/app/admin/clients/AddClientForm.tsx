"use client";

import { useActionState } from "react";
import { addClientAction, type AddClientState } from "../actions";
import { CONSTRUCTION_STAGES } from "@/lib/construction-stages";

const initialState: AddClientState = {};

export default function AddClientForm() {
  const [state, formAction, pending] = useActionState(
    addClientAction,
    initialState
  );

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
      <h2 className="text-base font-semibold text-slate-200">Новый клиент</h2>

      {state.success && (
        <p className="mt-3 rounded-md bg-emerald-900/40 px-3 py-2 text-sm text-emerald-300">
          Клиент успешно добавлен.
        </p>
      )}
      {state.error && (
        <p className="mt-3 rounded-md bg-red-900/40 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <form className="mt-4 grid gap-3 sm:grid-cols-2" action={formAction}>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs text-slate-400">
            ФИО <span className="text-red-400">*</span>
          </label>
          <input
            name="full_name"
            required
            placeholder="Иванов Иван Иванович"
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-600"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-slate-400">
            Номер договора <span className="text-red-400">*</span>
          </label>
          <input
            name="contract_number"
            required
            placeholder="Д-1024"
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-600"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-slate-400">
            Телефон <span className="text-red-400">*</span>
          </label>
          <input
            name="phone"
            type="tel"
            required
            placeholder="+7 900 000-00-00"
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-600"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs text-slate-400">
            Адрес объекта <span className="text-red-400">*</span>
          </label>
          <input
            name="object_address"
            required
            placeholder="Московская обл., д. Пример, ул. Строителей, 12"
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-600"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-slate-400">
            Имя менеджера
          </label>
          <input
            name="manager_name"
            placeholder="Пётр Сидоров"
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-600"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-slate-400">
            Телефон менеджера
          </label>
          <input
            name="manager_phone"
            type="tel"
            placeholder="+7 900 000-00-00"
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-600"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs text-slate-400">
            Текущий этап строительства
          </label>
          <select
            name="current_stage"
            defaultValue={1}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-600"
          >
            {CONSTRUCTION_STAGES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id}. {s.title}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-amber-500 disabled:opacity-60 sm:col-span-2"
        >
          {pending ? "Сохранение…" : "Добавить клиента"}
        </button>
      </form>
    </section>
  );
}
