export default function DashboardLoading() {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="flex flex-1 flex-col px-5 py-12 sm:px-8 sm:py-16 lg:px-12"
    >
      <span className="sr-only">Cargando tus mazos…</span>
      <section className="mx-auto w-full max-w-6xl animate-pulse">
        <div className="border-b border-line pb-8">
          <div className="h-3 w-28 rounded bg-line" />
          <div className="mt-3 h-12 w-64 max-w-full rounded bg-line sm:h-14" />
          <div className="mt-4 h-4 w-[min(32rem,100%)] rounded bg-line" />
        </div>
        <div className="mt-8 flex items-center justify-between gap-4 pb-5">
          <div className="h-8 w-40 rounded bg-line" />
          <div className="h-11 w-32 rounded bg-forest/20" />
        </div>
        <ol className="divide-y divide-line border-y border-line">
          {[0, 1].map((item) => (
            <li key={item} className="grid gap-x-6 gap-y-4 py-6 sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:items-center sm:py-8">
              <div className="h-4 w-6 rounded bg-line" />
              <div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="h-9 w-56 max-w-full rounded bg-line" />
                  <div className="h-6 w-24 rounded border border-line bg-paper" />
                </div>
                <div className="mt-4 h-4 w-[min(30rem,100%)] rounded bg-line" />
              </div>
              <div className="h-9 w-24 rounded bg-paper" />
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
