"use client";

import { useActionState } from "react";
import { createDeckAction } from "@/lib/data/deck-actions";

type CreateDeckFormState = {
  errors?: {
    name?: string;
    format?: string;
    description?: string;
  };
  message?: string;
};

const initialState: CreateDeckFormState = {};

export function CreateDeckForm() {
  const [state, formAction, isPending] = useActionState(createDeckAction, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-6">
      {state.message ? (
        <p role="alert" className="rounded-lg border border-red-300/30 bg-red-950/40 p-4 text-red-100">
          {state.message}
        </p>
      ) : null}

      <div>
        <label htmlFor="deck-name" className="mb-2 block font-medium">Nombre</label>
        <input
          id="deck-name"
          name="name"
          type="text"
          required
          minLength={1}
          maxLength={80}
          aria-invalid={Boolean(state.errors?.name)}
          aria-describedby={state.errors?.name ? "deck-name-error" : undefined}
          className="min-h-12 w-full rounded-lg border border-white/20 bg-zinc-900 px-4 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
        />
        {state.errors?.name ? <p id="deck-name-error" className="mt-2 text-sm text-red-200">{state.errors.name}</p> : null}
      </div>

      <div>
        <label htmlFor="deck-format" className="mb-2 block font-medium">Formato</label>
        <select
          id="deck-format"
          name="format"
          required
          defaultValue="standard"
          aria-invalid={Boolean(state.errors?.format)}
          aria-describedby={state.errors?.format ? "deck-format-error" : undefined}
          className="min-h-12 w-full rounded-lg border border-white/20 bg-zinc-900 px-4 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
        >
          <option value="standard">Standard</option>
          <option value="commander">Commander</option>
        </select>
        {state.errors?.format ? <p id="deck-format-error" className="mt-2 text-sm text-red-200">{state.errors.format}</p> : null}
      </div>

      <div>
        <label htmlFor="deck-description" className="mb-2 block font-medium">Descripción (opcional)</label>
        <textarea
          id="deck-description"
          name="description"
          rows={5}
          maxLength={500}
          aria-invalid={Boolean(state.errors?.description)}
          aria-describedby={state.errors?.description ? "deck-description-error" : "deck-description-help"}
          className="w-full rounded-lg border border-white/20 bg-zinc-900 px-4 py-3 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
        />
        {state.errors?.description ? (
          <p id="deck-description-error" className="mt-2 text-sm text-red-200">{state.errors.description}</p>
        ) : (
          <p id="deck-description-help" className="mt-2 text-sm text-zinc-400">Máximo 500 caracteres.</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-12 items-center justify-center rounded-lg bg-violet-300 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-violet-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300 disabled:cursor-wait disabled:opacity-70"
      >
        {isPending ? "Creando mazo…" : "Crear mazo"}
      </button>
    </form>
  );
}
