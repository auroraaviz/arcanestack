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
      {state.message ? <p role="alert" className="mb-3 text-sm text-red-200">{state.message}</p> : null}
      <button type="submit" disabled={isPending} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-red-300/40 px-4 py-2 font-semibold text-red-100 transition hover:bg-red-950/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-200 disabled:opacity-70">{isPending ? "Borrando…" : "Borrar mazo"}</button>
    </form>
  );
}
