import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Flashcard } from "@/lib/study-set";

export function FlashcardDeck({ cards }: { cards: Flashcard[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = cards[index];

  const go = (next: number) => {
    setFlipped(false);
    setIndex(next);
  };

  return (
    <section aria-labelledby="flashcards-heading" className="space-y-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="flashcards-heading" className="text-2xl font-semibold sm:text-3xl">
          Flashcards
        </h2>
        <p className="text-sm text-muted-foreground">
          Card {index + 1} of {cards.length}
        </p>
      </div>

      <div className="flip-scene">
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          aria-live="polite"
          className="flip-inner relative block min-h-[260px] w-full cursor-pointer text-left sm:min-h-[300px]"
          style={{ transform: flipped ? "rotateY(180deg)" : "none" }}
        >
          <span className="flip-face card-surface absolute inset-0 flex flex-col justify-between gap-6 p-6 sm:p-8">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Question
            </span>
            <span className="font-display text-xl leading-snug sm:text-2xl">{card.question}</span>
            <span className="text-sm text-muted-foreground">Tap the card to reveal the answer</span>
          </span>

          <span
            className="flip-face card-surface absolute inset-0 flex flex-col justify-between gap-6 bg-primary p-6 text-primary-foreground sm:p-8"
            style={{ transform: "rotateY(180deg)" }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">
              Answer
            </span>
            <span className="text-lg leading-relaxed sm:text-xl">{card.answer}</span>
            <span className="text-sm opacity-70">Tap to flip back</span>
          </span>
        </button>
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          className="rounded-full"
        >
          <ChevronLeft className="size-4" /> Previous
        </Button>
        <Button variant="ghost" onClick={() => setFlipped((f) => !f)} className="rounded-full">
          <RotateCcw className="size-4" /> Flip
        </Button>
        <Button
          variant="outline"
          onClick={() => go(index + 1)}
          disabled={index === cards.length - 1}
          className="rounded-full"
        >
          Next <ChevronRight className="size-4" />
        </Button>
      </div>
    </section>
  );
}
