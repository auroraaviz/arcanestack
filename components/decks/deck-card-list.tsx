import Image from "next/image";
import type { DeckCard } from "@/lib/data/deck-cards";
import { DeckCardControls } from "@/components/decks/deck-card-controls";

export function DeckCardList({ deckId, cards }: { deckId: string; cards: DeckCard[] }) {
  if (cards.length === 0) {
    return (
      <p className="mt-5 border border-dashed border-line bg-paper p-6 text-ink-muted">
        Este mazo todavía no tiene cartas.
      </p>
    );
  }

  return (
    <ul className="mt-4 divide-y divide-line border-y border-line">
      {cards.map((card) => (
        <li key={card.id} className="flex min-w-0 flex-col gap-4 bg-paper/70 py-5 sm:flex-row sm:items-start sm:gap-6 sm:px-4">
          {card.image_url ? (
            <Image
              src={card.image_url}
              alt={card.card_name}
              width={140}
              height={196}
              className="h-auto w-24 shrink-0 self-start object-contain sm:w-28"
            />
          ) : (
            <div
              role="img"
              aria-label={`Imagen no disponible: ${card.card_name}`}
              className="flex h-[134px] w-24 shrink-0 items-center justify-center border border-line bg-page p-2 text-center text-xs text-ink-muted sm:h-[156px] sm:w-28"
            >
              Imagen no disponible
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="break-words font-serif text-xl font-medium leading-snug text-forest-deep">{card.card_name}</h3>
            <p className="mt-1 font-mono text-sm text-ink-muted">En el mazo: {card.quantity}</p>
            <DeckCardControls key={`${card.id}-${card.quantity}`} deckId={deckId} card={card} />
          </div>
        </li>
      ))}
    </ul>
  );
}
