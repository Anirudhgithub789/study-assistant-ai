import { AlertTriangle, BookOpen, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState() {
  return (
    <div className="space-y-6" role="status" aria-live="polite">
      <div className="card-surface space-y-4 p-6 sm:p-8">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Building your summary, flashcards, and quiz…
      </p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="card-surface flex flex-col items-center gap-4 p-8 text-center sm:p-12"
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-6" />
      </span>
      <h2 className="text-xl font-semibold">We couldn't build that study set</h2>
      <p className="max-w-md text-sm text-muted-foreground">{message}</p>
      <Button onClick={onRetry} className="rounded-full">
        <RefreshCw className="size-4" /> Try again
      </Button>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="card-surface flex flex-col items-center gap-4 p-8 text-center sm:p-12">
      <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <BookOpen className="size-6" />
      </span>
      <h2 className="text-xl font-semibold">Nothing to study yet</h2>
      <p className="max-w-md text-sm text-muted-foreground">
        Paste your lecture notes, a textbook passage, or just a topic like “photosynthesis” above,
        then generate to get a summary, flashcards, and a quiz.
      </p>
    </div>
  );
}
