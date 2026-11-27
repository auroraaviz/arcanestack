"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AddCardForm } from "@/components/decks/add-card-form";
import type { ScryfallCard } from "@/lib/scryfall";

type SearchState = "idle" | "loading" | "success" | "empty" | "error";
type SearchPayload = { results?: ScryfallCard[]; error?: string };

export function CardSearch({ deckId }: { deckId: string }) {
  const [query, setQuery] = useState("");
  const [cards, setCards] = useState<ScryfallCard[]>([]);
  const [status, setStatus] = useState<SearchState>("idle");
  const [error, setError] = useState("");
  const searchTerm = query.trim();

  useEffect(() => {
    if (searchTerm.length < 2) return;

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setStatus("loading");
      setError("");
      try {
        const response = await fetch(`/api/cards/search?q=${encodeURIComponent(searchTerm)}`, {
          signal: controller.signal,
        });
        const payload = (await response.json()) as SearchPayload;
        if (!response.ok) throw new Error(payload.error || "No se pudo completar la búsqueda.");

        const results = payload.results ?? [];
        setCards(results);
        setStatus(results.length === 0 ? "empty" : "success");
      } catch (fetchError) {
        if (controller.signal.aborted) return;
        setError(fetchError instanceof Error ? fetchError.message : "No se pudo completar la búsqueda.");
        setStatus("error");
      }
    }, 400);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [searchTerm]);

  function handleQueryChange(value: string) {
    setQuery(value);
    setStatus("idle");
    setError("");
    if (value.trim().length < 2) setCards([]);
  }

  return (
    <section aria-labelledby="card-search-heading" className="mt-10 border-t border-white/10 pt-8">
      <h2 id="card-search-heading" className="text-2xl font-semibold">Buscar cartas</h2>
      <label htmlFor="card-search-query" className="mt-4 block font-medium">Nombre o texto de carta</label>
      <input
        id="card-search-query"
        type="search"
        value={query}
        onChange={(event) => handleQueryChange(event.target.value)}
        minLength={2}
        maxLength={100}
        autoComplete="off"
        aria-describedby="card-search-help"
        className="mt-2 min-h-12 w-full rounded-lg border border-white/20 bg-zinc-900 px-4 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
        placeholder="Ej. Lightning Bolt"
      />
      <p id="card-search-help" className="mt-2 text-sm text-zinc-400">Escribe al menos 2 caracteres.</p>
      <div className="mt-4" aria-live="polite" aria-busy={status === "loading"}>
        {searchTerm.length < 2 ? <p className="text-zinc-400">Escribe para buscar cartas.</p> : null}
        {status === "loading" ? <p className="text-violet-200">Buscando cartas…</p> : null}
        {status === "empty" ? <p className="text-zinc-300">No se encontraron cartas.</p> : null}
        {status === "error" ? <p role="alert" className="text-red-200">{error}</p> : null}
      </div>
      {status === "success" ? (
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {cards.map((card) => (
            <li key={card.scryfall_id} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              {card.image_url ? (
                <Image src={card.image_url} alt={card.name} width={112} height={156} className="h-auto w-28 shrink-0 object-contain" />
              ) : (
                <div className="flex h-[156px] w-28 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-zinc-900 p-2 text-center text-xs text-zinc-400" aria-label={`Imagen no disponible: ${card.name}`}>
                  Imagen no disponible
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold leading-snug">{card.name}</h3>
                <p className="mt-2 text-sm text-zinc-400">{card.type_line}</p>
                <AddCardForm deckId={deckId} scryfallId={card.scryfall_id} />
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
