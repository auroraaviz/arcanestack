"use client";

import { useActionState } from "react";
import { editDeckAction, type EditDeckState } from "@/lib/data/deck-actions";
import type { Deck } from "@/lib/data/decks";

const initialState: EditDeckState = {};

export function EditDeckForm({ deck }: { deck: Deck }) {
  const [state, formAction, isPending] = useActionState(editDeckAction, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-6 border-t border-line pt-6">
      <input type="hidden" name="deckId" value={deck.id} />
      {state.message ? <p role="alert" className="border border-red-800 bg-red-50 p-4 text-red-900">{state.message}</p> : null}
      <div>
        <label htmlFor="edit-deck-name" className="mb-2 block text-sm font-semibold text-ink">Nombre</label>
        <input id="edit-deck-name" name="name" type="text" required minLength={1} maxLength={80} defaultValue={deck.name} aria-invalid={Boolean(state.errors?.name)} aria-describedby={state.errors?.name ? "edit-deck-name-error" : undefined} className="min-h-12 w-full border border-line bg-page px-4 text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest" />
        {state.errors?.name ? <p id="edit-deck-name-error" className="mt-2 text-sm font-medium text-red-800">{state.errors.name}</p> : null}
      </div>
      <div>
        <label htmlFor="edit-deck-format" className="mb-2 block text-sm font-semibold text-ink">Formato</label>
        <select id="edit-deck-format" name="format" required defaultValue={deck.format} aria-invalid={Boolean(state.errors?.format)} aria-describedby={state.errors?.format ? "edit-deck-format-error" : undefined} className="min-h-12 w-full border border-line bg-page px-4 text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest">
          <option value="standard">Standard</option>
          <option value="commander">Commander</option>
        </select>
        {state.errors?.format ? <p id="edit-deck-format-error" className="mt-2 text-sm font-medium text-red-800">{state.errors.format}</p> : null}
      </div>
      <div>
        <label htmlFor="edit-deck-description" className="mb-2 block text-sm font-semibold text-ink">Descripción (opcional)</label>
        <textarea id="edit-deck-description" name="description" rows={5} maxLength={500} defaultValue={deck.description ?? ""} aria-invalid={Boolean(state.errors?.description)} aria-describedby={state.errors?.description ? "edit-deck-description-error" : "edit-deck-description-help"} className="w-full border border-line bg-page px-4 py-3 text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest" />
        {state.errors?.description ? <p id="edit-deck-description-error" className="mt-2 text-sm font-medium text-red-800">{state.errors.description}</p> : <p id="edit-deck-description-help" className="mt-2 text-sm text-ink-muted">Máximo 500 caracteres.</p>}
      </div>
      <button type="submit" disabled={isPending} className="inline-flex min-h-12 items-center justify-center bg-forest px-6 py-3 font-semibold text-paper transition-colors hover:bg-forest-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest disabled:cursor-wait disabled:opacity-70">{isPending ? "Guardando…" : "Guardar cambios"}</button>
    </form>
  );
}
