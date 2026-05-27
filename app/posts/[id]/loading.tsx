export default function PostDetailLoading() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div className="h-10 w-36 animate-pulse rounded-full bg-muted" />
          <div className="h-4 w-32 animate-pulse rounded-full bg-muted" />
        </div>

        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="border-b border-border/70 px-5 py-7 text-center sm:px-8 sm:py-8">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
              <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
              <div className="h-11 w-full max-w-2xl animate-pulse rounded-2xl bg-muted" />
              <div className="h-4 w-40 animate-pulse rounded-full bg-muted" />
            </div>
          </div>

          <div className="px-5 py-7 sm:px-8 sm:py-10">
            <div className="mx-auto max-w-2xl space-y-4">
              <div className="h-4 w-full animate-pulse rounded-full bg-muted" />
              <div className="h-4 w-11/12 animate-pulse rounded-full bg-muted" />
              <div className="h-4 w-10/12 animate-pulse rounded-full bg-muted" />
              <div className="h-4 w-9/12 animate-pulse rounded-full bg-muted" />
              <div className="h-4 w-8/12 animate-pulse rounded-full bg-muted" />
            </div>

            <div className="mt-8 h-11 w-40 animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}