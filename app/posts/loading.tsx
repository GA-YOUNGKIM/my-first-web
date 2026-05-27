export default function PostsLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="border-b border-border/70 px-5 py-7 sm:px-8 sm:py-8">
          <div className="space-y-3">
            <div className="h-3 w-20 animate-pulse rounded-full bg-muted" />
            <div className="h-10 w-3/4 max-w-xl animate-pulse rounded-2xl bg-muted" />
            <div className="h-4 w-full max-w-2xl animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-5/6 max-w-xl animate-pulse rounded-full bg-muted" />
          </div>
        </div>

        <div className="px-5 py-5 sm:px-8 sm:py-6">
          <div className="mb-5 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span className="h-4 w-28 animate-pulse rounded-full bg-muted" />
            <span className="h-4 w-32 animate-pulse rounded-full bg-muted" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-border bg-background p-5 shadow-sm"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
                    <div className="h-4 w-24 animate-pulse rounded-full bg-muted" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-6 w-11/12 animate-pulse rounded-full bg-muted" />
                    <div className="h-6 w-3/4 animate-pulse rounded-full bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full animate-pulse rounded-full bg-muted" />
                    <div className="h-4 w-5/6 animate-pulse rounded-full bg-muted" />
                    <div className="h-4 w-2/3 animate-pulse rounded-full bg-muted" />
                  </div>
                  <div className="h-10 w-24 animate-pulse rounded-xl bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}