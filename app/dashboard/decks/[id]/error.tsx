"use client";

export default function DeckError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <h1 className="font-serif text-3xl font-semibold text-forest-deep">No se pudo cargar el mazo</h1>
      <p className="mt-3 text-ink-muted">Ha ocurrido un error al consultar sus datos.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-md bg-forest px-5 py-3 font-semibold text-paper transition-colors hover:bg-forest-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
      >
        Reintentar
      </button>
    </main>
  );
}
