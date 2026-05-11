"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { uploadPhotosAction, type UploadPhotosState } from "./actions";

export type ClientOption = {
  id: string;
  full_name: string;
  contract_number: string;
};

const initialState: UploadPhotosState = {};

export default function PhotoUploadForm({ clients }: { clients: ClientOption[] }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    uploadPhotosAction,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
      <h2 className="text-base font-semibold text-slate-200">Загрузка фото</h2>
      <p className="mt-1 text-sm text-slate-400">
        Файлы попадают в bucket <code className="text-amber-400">photo</code>,
        в базу — таблица <code className="text-amber-400">photos</code>.
      </p>

      {state.success && state.uploaded != null && (
        <p className="mt-4 rounded-md bg-emerald-900/40 px-3 py-2 text-sm text-emerald-300">
          Загружено файлов: {state.uploaded}
        </p>
      )}
      {state.error && (
        <p className="mt-4 rounded-md bg-red-900/40 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <form
        ref={formRef}
        className="mt-6 space-y-4"
        action={formAction}
        encType="multipart/form-data"
      >
        <div>
          <label
            htmlFor="client_id"
            className="mb-1 block text-xs font-medium text-slate-400"
          >
            Клиент
          </label>
          <select
            id="client_id"
            name="client_id"
            required
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-600"
            defaultValue=""
          >
            <option value="" disabled>
              {clients.length === 0
                ? "Нет клиентов — сначала добавьте в разделе «Клиенты»"
                : "Выберите клиента"}
            </option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.full_name} — договор {c.contract_number}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="files"
            className="mb-1 block text-xs font-medium text-slate-400"
          >
            Фотографии (можно несколько)
          </label>
          <input
            id="files"
            name="files"
            type="file"
            accept="image/*"
            multiple
            required
            className="block w-full text-sm text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-amber-600 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-950 hover:file:bg-amber-500"
          />
        </div>

        <div>
          <label
            htmlFor="caption"
            className="mb-1 block text-xs font-medium text-slate-400"
          >
            Подпись ко всем фото в этой загрузке (необязательно)
          </label>
          <input
            id="caption"
            name="caption"
            type="text"
            maxLength={2000}
            placeholder="Например: Монтаж кровли, май 2026"
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-600"
          />
        </div>

        <button
          type="submit"
          disabled={pending || clients.length === 0}
          className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-amber-500 disabled:opacity-50"
        >
          {pending ? "Загрузка…" : "Загрузить"}
        </button>
      </form>
    </section>
  );
}
