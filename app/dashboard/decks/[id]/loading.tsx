export default function DeckLoading() {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="min-h-screen bg-zinc-950 px-6 py-12 text-zinc-100 sm:px-10"
    >
      <div role="status" className="mx-auto w-full max-w-3xl animate-pulse">
        <span className="sr-only">Cargando los datos del mazo…</span>
        <div className="h-5 w-36 rounded bg-white/10" />
        <div className="mt-8 h-10 w-72 max-w-full rounded bg-white/10" />
        <div className="mt-4 h-6 w-40 rounded bg-white/10" />
        <div className="mt-8 h-36 rounded-2xl border border-white/10 bg-white/[0.03]" />
      </div>
    </main>
  );
}
