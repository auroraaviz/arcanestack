"use client";

export default function DeckError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-[50vh] flex-col items-center justify-center bg-zinc-950 px-6 py-12 text-center text-zinc-100">
      <h1 className="text-2xl font-bold">No se pudo cargar el mazo</h1>
      <p className="mt-3 text-zinc-300">Ha ocurrido un error al consultar sus datos.</p>
      <button type="button" onClick={reset} className="mt-6 rounded-lg bg-violet-300 px-5 py-3 font-semibold text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300">Reintentar</button>
    </main>
  );
}
