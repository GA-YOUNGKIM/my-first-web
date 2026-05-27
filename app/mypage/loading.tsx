export default function MyPageLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <section className="space-y-6">
        <div className="space-y-3">
          <div className="h-3 w-24 animate-pulse rounded-full bg-muted" />
          <div className="h-10 w-2/3 max-w-xl animate-pulse rounded-2xl bg-muted" />
          <div className="h-4 w-full max-w-2xl animate-pulse rounded-full bg-muted" />
          <div className="h-4 w-5/6 max-w-xl animate-pulse rounded-full bg-muted" />
        </div>

        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="space-y-6">
              <div className="h-20 w-20 animate-pulse rounded-full bg-muted" />
              <div className="space-y-3">
                <div className="h-6 w-40 animate-pulse rounded-full bg-muted" />
                <div className="h-4 w-full animate-pulse rounded-full bg-muted" />
                <div className="h-4 w-5/6 animate-pulse rounded-full bg-muted" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-border bg-background px-4 py-3">
                  <div className="h-3 w-16 animate-pulse rounded-full bg-muted" />
                  <div className="mt-3 h-8 w-12 animate-pulse rounded-full bg-muted" />
                </div>
                <div className="rounded-2xl border border-border bg-background px-4 py-3">
                  <div className="h-3 w-16 animate-pulse rounded-full bg-muted" />
                  <div className="mt-3 h-8 w-12 animate-pulse rounded-full bg-muted" />
                </div>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <div className="h-11 w-full animate-pulse rounded-xl bg-muted" />
                <div className="h-11 w-full animate-pulse rounded-xl bg-muted" />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="space-y-4">
              <div className="h-6 w-32 animate-pulse rounded-full bg-muted" />
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="rounded-2xl border border-border bg-background p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="h-5 w-44 animate-pulse rounded-full bg-muted" />
                      <div className="h-4 w-80 max-w-full animate-pulse rounded-full bg-muted" />
                    </div>
                    <div className="h-4 w-20 animate-pulse rounded-full bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}