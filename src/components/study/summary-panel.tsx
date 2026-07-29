import { Sparkles } from "lucide-react";

import type { StudySet } from "@/lib/study-set";

export function SummaryPanel({ studySet }: { studySet: StudySet }) {
  return (
    <section aria-labelledby="summary-heading" className="card-surface space-y-6 p-6 sm:p-8">
      <div className="space-y-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent-foreground">
          <Sparkles className="size-3.5" /> Study set
        </span>
        <h2 id="summary-heading" className="text-3xl font-semibold sm:text-4xl">
          {studySet.title}
        </h2>
      </div>

      <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
        {studySet.summary}
      </p>

      {studySet.keyPoints.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2">
          {studySet.keyPoints.map((point, i) => (
            <li key={i} className="flex gap-3 rounded-xl bg-secondary p-4 text-sm leading-relaxed">
              <span className="font-display text-lg font-semibold text-primary">{i + 1}</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
