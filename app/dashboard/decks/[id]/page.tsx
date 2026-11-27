import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getDeck } from "@/lib/data/decks";
import { listDeckCards, type DeckCard } from "@/lib/data/deck-cards";
import { DeleteDeckForm } from "@/components/decks/delete-deck-form";
import { CardSearch } from "@/components/decks/card-search";
import { DeckCardList } from "@/components/decks/deck-card-list";
import { validateDeckSize } from "@/lib/deck-validation";

export const instant = false;

export default async function DeckDetailPage({ params }: PageProps<"/dashboard/decks/[id]">) {
  await connection();
  const { id } = await params;
  const deck = await getDeck(id);
  if (!deck) notFound();

  let cards: DeckCard[] = [];
  let cardsLoadError = false;
  try {
    cards = await listDeckCards(id);
  } catch {
    cardsLoadError = true;
  }
  const deckValidity = cardsLoadError ? null : validateDeckSize(deck.format, cards);

  return (
    <main className="mx-auto flex-1 w-full max-w-7xl px-5 py-10 text-ink sm:px-8 sm:py-14">
      <article className="mx-auto w-full max-w-5xl">
        <Link href="/dashboard" className="text-sm font-medium text-forest underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest">Volver a mis mazos</Link>
        <header className="relative mt-10 border-b border-line pb-8 sm:mt-14 sm:pb-10">
          <span aria-hidden="true" className="absolute right-2 top-0 hidden text-gilt/70 sm:block"><svg viewBox="0 0 32 32" fill="none" className="h-9 w-9"><path d="M16 2v28M2 16h28M6.1 6.1l19.8 19.8M25.9 6.1 6.1 25.9" stroke="currentColor" strokeWidth=".8"/></svg></span>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-muted">Detalle del mazo</p>
          <h1 className="mt-3 max-w-4xl font-serif text-4xl font-medium leading-tight tracking-tight text-forest-deep sm:text-6xl">{deck.name}</h1>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-forest-deep">
            <span aria-hidden="true" className="text-gilt"><svg viewBox="0 0 16 16" fill="none" className="h-3 w-3"><path d="M8 1.5 14.5 8 8 14.5 1.5 8 8 1.5Z" stroke="currentColor" strokeWidth="1"/></svg></span> Formato: {deck.format}
          </p>
        </header>
        <section aria-labelledby="description-heading" className="mt-7 max-w-3xl border-l-2 border-gilt/70 bg-paper px-5 py-4 sm:px-7">
          <h2 id="description-heading" className="font-serif text-xl font-semibold text-forest-deep">Descripción</h2>
          <p className="mt-3 whitespace-pre-wrap leading-7 text-ink-muted">{deck.description || "Sin descripción."}</p>
        </section>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href={`/dashboard/decks/${deck.id}/edit`} className="inline-flex min-h-11 items-center justify-center rounded-md bg-forest px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-forest-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest">Editar mazo</Link>
          <DeleteDeckForm deckId={deck.id} />
        </div>
        <CardSearch deckId={deck.id} />
        <section aria-labelledby="deck-cards-heading" className="mt-12 border-t border-line pt-8 sm:mt-16 sm:pt-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">Inventario</p>
              <h2 id="deck-cards-heading" className="mt-1 font-serif text-3xl font-medium text-forest-deep">Cartas del mazo</h2>
            </div>
            <span aria-hidden="true" className="hidden h-px flex-1 bg-line sm:block" />
          </div>
          {deckValidity ? (
            <p
              role="status"
              aria-live="polite"
              className={`mb-5 flex items-start gap-3 border p-4 ${
                deckValidity.isValid
                  ? "border-forest/35 bg-paper text-forest-deep"
                  : "border-gilt/70 bg-paper text-ink"
              }`}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="mt-0.5 h-5 w-5 shrink-0 text-forest">
                {deckValidity.isValid ? <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /> : <><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 7v5m0 3h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></>}
              </svg>
              <span><span className="block font-mono text-xs font-semibold uppercase tracking-wider text-ink-muted">Total de cartas: {deckValidity.totalCards}</span><span className="mt-1 block font-medium">{deckValidity.message}</span></span>
            </p>
          ) : null}
          {cardsLoadError ? (
            <div role="alert" className="mt-5 border border-red-900/25 bg-paper p-6 text-ink">
              <p>No se pudieron cargar las cartas de este mazo.</p>
              <p role="status" className="mt-2 text-ink-muted">
                No se puede calcular la validez del mazo sin sus cartas.
              </p>
              <Link
                href={`/dashboard/decks/${deck.id}`}
                className="mt-4 inline-flex rounded-md border border-line px-4 py-2 font-medium text-forest underline-offset-4 hover:bg-page hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
              >
                Reintentar
              </Link>
            </div>
          ) : (
            <DeckCardList deckId={deck.id} cards={cards} />
          )}
        </section>
      </article>
    </main>
  );
}
