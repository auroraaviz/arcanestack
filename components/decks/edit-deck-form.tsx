"use client";

import { useActionState } from "react";
import { editDeckAction, type EditDeckState } from "@/lib/data/deck-actions";
import type { Deck } from "@/lib/data/decks";

const initialState: EditDeckState = {};

export function EditDeckForm({ deck }: { deck: Deck }) {
  const [state, formAction, isPending] = useActionState(editDeckAction, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-6">
      <input type="hidden" name="deckId" value={deck.id} />
      {state.message ? <p role="alert" className="rounded-lg border border-red-300/30 bg-red-950/40 p-4 text-red-100">{state.message}</p> : null}
      <div>
        <label htmlFor="edit-deck-name" className="mb-2 block font-medium">Nombre</label>
        <input id="edit-deck-name" name="name" type="text" required minLength={1} maxLength={80} defaultValue={deck.name} aria-invalid={Boolean(state.errors?.name)} aria-describedby={state.errors?.name ? "edit-deck-name-error" : undefined} className="min-h-12 w-full rounded-lg border border-white/20 bg-zinc-900 px-4 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300" />
        {state.errors?.name ? <p id="edit-deck-name-error" className="mt-2 text-sm text-red-200">{state.errors.name}</p> : null}
      </div>
      <div>
        <label htmlFor="edit-deck-format" className="mb-2 block font-medium">Formato</label>
        <select id="edit-deck-format" name="format" required defaultValue={deck.format} aria-invalid={Boolean(state.errors?.format)} aria-describedby={state.errors?.format ? "edit-deck-format-error" : undefined} className="min-h-12 w-full rounded-lg border border-white/20 bg-zinc-900 px-4 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300">
          <option value="standard">Standard</option>
          <option value="commander">Commander</option>
        </select>
        {state.errors?.format ? <p id="edit-deck-format-error" className="mt-2 text-sm text-red-200">{state.errors.format}</p> : null}
      </div>
      <div>
        <label htmlFor="edit-deck-description" className="mb-2 block font-medium">Descripción (opcional)</label>
        <textarea id="edit-deck-description" name="description" rows={5} maxLength={500} defaultValue={deck.description ?? ""} aria-invalid={Boolean(state.errors?.description)} aria-describedby={state.errors?.description ? "edit-deck-description-error" : "edit-deck-description-help"} className="w-full rounded-lg border border-white/20 bg-zinc-900 px-4 py-3 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300" />
        {state.errors?.description ? <p id="edit-deck-description-error" className="mt-2 text-sm text-red-200">{state.errors.description}</p> : <p id="edit-deck-description-help" className="mt-2 text-sm text-zinc-400">Máximo 500 caracteres.</p>}
      </div>
      <button type="submit" disabled={isPending} className="inline-flex min-h-12 items-center justify-center rounded-lg bg-violet-300 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-violet-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300 disabled:cursor-wait disabled:opacity-70">{isPending ? "Guardando…" : "Guardar cambios"}</button>
    </form>
  );
}
