"use client";

import { useActionState } from "react";
import { addDeckCardAction } from "@/lib/data/deck-card-actions";
import type { DeckCardActionResult } from "@/lib/data/deck-cards";

const initialState: DeckCardActionResult = {};

export function AddCardForm({ deckId, scryfallId }: { deckId: string; scryfallId: string }) {
  const action = addDeckCardAction.bind(null, deckId);
  const [state, formAction, isPending] = useActionState(action, initialState);
  const quantityId = `quantity-${scryfallId}`;

  return (
    <form action={formAction} className="mt-4 flex flex-wrap items-end gap-3">
      <input type="hidden" name="scryfall_id" value={scryfallId} />
      <div>
        <label htmlFor={quantityId} className="mb-1 block text-sm font-medium text-zinc-200">
          Cantidad
        </label>
        <select
          id={quantityId}
          name="quantity"
          defaultValue="1"
          className="min-h-10 rounded-lg border border-white/20 bg-zinc-900 px-3 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
        >
          {Array.from({ length: 100 }, (_, index) => index + 1).map((quantity) => (
            <option key={quantity} value={quantity}>{quantity}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-10 items-center justify-center rounded-lg bg-violet-300 px-4 py-2 font-semibold text-zinc-950 transition hover:bg-violet-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300 disabled:cursor-wait disabled:opacity-70"
      >
        {isPending ? "Añadiendo…" : "Añadir"}
      </button>
      {state.error ? <p role="alert" className="w-full text-sm text-red-200">{state.error}</p> : null}
      {state.message ? <p role="status" className="w-full text-sm text-emerald-200">{state.message}</p> : null}
    </form>
  );
}
