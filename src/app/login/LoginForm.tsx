"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form className="mt-10 space-y-4" action={formAction}>
      <div>
        <label
          htmlFor="contract"
          className="block text-sm font-medium text-stone-700"
        >
          Номер договора
        </label>
        <input
          id="contract"
          name="contract"
          type="text"
          autoComplete="off"
          required
          className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 shadow-sm outline-none ring-stone-400 focus:ring-2"
          placeholder="Например, Д-1024"
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-stone-700"
        >
          Телефон
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 shadow-sm outline-none ring-stone-400 focus:ring-2"
          placeholder="+7 …"
        />
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-60"
      >
        {pending ? "Проверяем…" : "Войти"}
      </button>
    </form>
  );
}
