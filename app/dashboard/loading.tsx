export default function DashboardLoading() {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="flex min-h-screen flex-col bg-zinc-950 px-6 py-16 text-zinc-100 sm:px-10"
    >
      <span className="sr-only">Cargando tus mazos…</span>
      <div className="mx-auto w-full max-w-5xl animate-pulse">
        <div className="h-10 w-64 rounded bg-white/10" />
        <div className="mt-5 h-6 w-96 max-w-full rounded bg-white/10" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="h-40 rounded-2xl border border-white/10 bg-white/[0.03]" />
          <div className="h-40 rounded-2xl border border-white/10 bg-white/[0.03]" />
        </div>
      </div>
    </main>
  );
}
