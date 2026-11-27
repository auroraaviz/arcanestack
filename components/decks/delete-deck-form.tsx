"use client";

import { useActionState } from "react";
import { deleteDeckAction, type DeleteDeckState } from "@/lib/data/deck-actions";

const initialState: DeleteDeckState = {};

export function DeleteDeckForm({ deckId }: { deckId: string }) {
  const [state, formAction, isPending] = useActionState(deleteDeckAction, initialState);

  function confirmDelete(event: React.FormEvent<HTMLFormElement>) {
    if (!window.confirm("¿Seguro que quieres borrar este mazo? Esta acción no se puede deshacer.")) {
      event.preventDefault();
    }
  }

  return (
    <form action={formAction} onSubmit={confirmDelete}>
      <input type="hidden" name="deckId" value={deckId} />
      {state.message ? <p role="alert" className="mb-3 text-sm text-danger">{state.message}</p> : null}
      <button type="submit" disabled={isPending} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-danger bg-danger px-4 py-2 font-semibold text-paper transition-colors hover:border-danger-hover hover:bg-danger-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest disabled:opacity-70">{isPending ? "Borrando…" : "Borrar mazo"}</button>
    </form>
  );
}
