import { createFileRoute } from "@tanstack/react-router";

import { NotesForm } from "@/components/study/notes-form";
import { SummaryPanel } from "@/components/study/summary-panel";
import { FlashcardDeck } from "@/components/study/flashcard-deck";
import { Quiz } from "@/components/study/quiz";
import { EmptyState, ErrorState, LoadingState } from "@/components/study/study-states";
import { useStudySet } from "@/hooks/use-study-set";

const TITLE = "Study Assistant — Instant summaries, flashcards & quizzes";
const DESCRIPTION =
  "Paste your notes or type a topic and get an AI-built study set: a clear summary, flippable flashcards, and a scored multiple-choice quiz.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudyAssistantPage,
});

function StudyAssistantPage() {
  const { status, studySet, error, generate, reset } = useStudySet();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10 space-y-4 text-center sm:mb-14">
        <span className="inline-flex items-center rounded-full border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          AI Study Assistant
        </span>
        <h1 className="text-4xl font-semibold leading-[1.05] sm:text-6xl">
          Turn messy notes into
          <span className="text-primary"> a study set</span>
        </h1>
        <p className="mx-auto max-w-xl text-base text-muted-foreground sm:text-lg">
          Drop in a topic or a wall of notes. You get a clean summary, flippable flashcards, and a
          quiz that tracks what you got wrong.
        </p>
      </header>

      <NotesForm isLoading={status === "loading"} onGenerate={generate} onClear={reset} />

      <div className="mt-10 space-y-10 sm:mt-14 sm:space-y-14">
        {status === "loading" && <LoadingState />}
        {status === "error" && (
          <ErrorState message={error ?? "Unknown error."} onRetry={reset} />
        )}
        {status === "idle" && !studySet && <EmptyState />}
        {status === "success" && studySet && (
          <>
            <SummaryPanel studySet={studySet} />
            <FlashcardDeck key={studySet.title} cards={studySet.flashcards} />
            <Quiz key={`quiz-${studySet.title}`} questions={studySet.quiz} />
          </>
        )}
      </div>

      <footer className="mt-16 text-center text-xs text-muted-foreground">
        Study sets are AI-generated — double-check anything critical.
      </footer>
    </main>
  );
}
