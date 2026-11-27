"use client";

import { useActionState } from "react";
import {
  changeDeckCardQuantityAction,
  removeDeckCardAction,
} from "@/lib/data/deck-card-actions";
import type { DeckCard, DeckCardActionResult } from "@/lib/data/deck-cards";

const initialState: DeckCardActionResult = {};

export function DeckCardControls({
  deckId,
  card,
}: {
  deckId: string;
  card: DeckCard;
}) {
  const changeAction = changeDeckCardQuantityAction.bind(null, deckId, card.id);
  const removeAction = removeDeckCardAction.bind(null, deckId, card.id);
  const [changeState, changeFormAction, isChanging] = useActionState(changeAction, initialState);
  const [removeState, removeFormAction, isRemoving] = useActionState(removeAction, initialState);
  const quantityId = `deck-card-quantity-${card.id}`;

  return (
    <div className="mt-4 space-y-3">
      <form action={changeFormAction} className="flex flex-wrap items-end gap-2">
        <div>
          <label htmlFor={quantityId} className="mb-1 block text-sm font-medium text-zinc-200">
            Cantidad
          </label>
          <select
            id={quantityId}
            name="quantity"
            defaultValue={String(card.quantity)}
            className="min-h-10 rounded-lg border border-white/20 bg-zinc-900 px-3 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
          >
            {Array.from({ length: 100 }, (_, index) => index + 1).map((quantity) => (
              <option key={quantity} value={quantity}>{quantity}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={isChanging}
          className="inline-flex min-h-10 items-center justify-center rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300 disabled:cursor-wait disabled:opacity-70"
        >
          {isChanging ? "Guardando…" : "Cambiar cantidad"}
        </button>
      </form>
      {changeState.error ? <p role="alert" className="text-sm text-red-200">{changeState.error}</p> : null}
      {changeState.message ? <p role="status" className="text-sm text-emerald-200">{changeState.message}</p> : null}
      <form action={removeFormAction}>
        <button
          type="submit"
          disabled={isRemoving}
          className="inline-flex min-h-10 items-center justify-center rounded-lg border border-red-300/40 px-3 py-2 text-sm font-semibold text-red-100 hover:bg-red-950/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-200 disabled:cursor-wait disabled:opacity-70"
        >
          {isRemoving ? "Quitando…" : "Quitar carta"}
        </button>
      </form>
      {removeState.error ? <p role="alert" className="text-sm text-red-200">{removeState.error}</p> : null}
      {removeState.message ? <p role="status" className="text-sm text-emerald-200">{removeState.message}</p> : null}
    </div>
  );
}
