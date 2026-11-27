export default function DeckLoading() {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="flex-1 px-5 py-10 sm:px-8 sm:py-14"
    >
      <div role="status" className="mx-auto w-full max-w-7xl animate-pulse">
        <article className="mx-auto w-full max-w-5xl">
          <div className="h-4 w-36 rounded bg-line" />
          <header className="relative mt-10 border-b border-line pb-8 sm:mt-14 sm:pb-10">
            <div className="h-3 w-32 rounded bg-line" />
            <div className="mt-3 h-12 w-[min(42rem,100%)] rounded bg-line sm:h-14" />
            <div className="mt-5 h-8 w-36 rounded-full border border-line bg-paper" />
          </header>
          <div className="mt-7 max-w-3xl border-l-2 border-gilt/70 bg-paper px-5 py-4 sm:px-7">
            <div className="h-6 w-36 rounded bg-line" />
            <div className="mt-3 h-4 w-[min(40rem,100%)] rounded bg-line" />
          </div>
          <div className="mt-8 flex gap-3">
            <div className="h-11 w-32 rounded bg-forest/20" />
            <div className="h-11 w-28 rounded bg-paper" />
          </div>
          <section className="mt-10 border-t border-line pt-8">
            <div className="h-8 w-44 rounded bg-line" />
            <div className="mt-5 h-12 w-full rounded border border-line bg-paper" />
            <div className="mt-10 h-8 w-52 rounded bg-line" />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="h-40 rounded border border-line bg-paper" />
              <div className="h-40 rounded border border-line bg-paper" />
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
