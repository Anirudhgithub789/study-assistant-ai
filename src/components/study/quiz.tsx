import { useMemo, useState } from "react";
import { Check, RefreshCw, Target, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/lib/study-set";

type Answers = Record<number, number>;

export function Quiz({ questions }: { questions: QuizQuestion[] }) {
  // Indices (into `questions`) that make up the current round.
  const [round, setRound] = useState<number[]>(() => questions.map((_, i) => i));
  const [position, setPosition] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [finished, setFinished] = useState(false);

  const questionIndex = round[position];
  const question = questions[questionIndex];

  const wrongIndices = useMemo(
    () => round.filter((i) => answers[i] !== questions[i].correctIndex),
    [round, answers, questions],
  );
  const correctCount = round.length - wrongIndices.length;

  const submit = (choice: number) => {
    if (selected !== null) return;
    setSelected(choice);
    setAnswers((prev) => ({ ...prev, [questionIndex]: choice }));
  };

  const next = () => {
    if (position + 1 < round.length) {
      setPosition(position + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  const startRound = (indices: number[]) => {
    setRound(indices);
    setPosition(0);
    setSelected(null);
    setFinished(false);
  };

  if (finished) {
    const percent = Math.round((correctCount / round.length) * 100);
    return (
      <section aria-labelledby="quiz-heading" className="card-surface space-y-6 p-6 text-center sm:p-10">
        <h2 id="quiz-heading" className="text-2xl font-semibold sm:text-3xl">
          Round complete
        </h2>
        <div>
          <p className="font-display text-6xl font-semibold text-primary">{percent}%</p>
          <p className="mt-2 text-muted-foreground">
            {correctCount} of {round.length} correct
          </p>
        </div>
        <Progress value={percent} className="mx-auto max-w-sm" />
        <div className="flex flex-wrap justify-center gap-3">
          {wrongIndices.length > 0 && (
            <Button onClick={() => startRound(wrongIndices)} className="rounded-full">
              <Target className="size-4" /> Retry {wrongIndices.length} incorrect
            </Button>
          )}
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => {
              setAnswers({});
              startRound(questions.map((_, i) => i));
            }}
          >
            <RefreshCw className="size-4" /> Restart full quiz
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="quiz-heading" className="space-y-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="quiz-heading" className="text-2xl font-semibold sm:text-3xl">
          Quiz
        </h2>
        <p className="text-sm text-muted-foreground">
          Question {position + 1} of {round.length}
        </p>
      </div>

      <Progress value={((position + (selected !== null ? 1 : 0)) / round.length) * 100} />

      <div className="card-surface space-y-6 p-6 sm:p-8">
        <p className="font-display text-xl leading-snug sm:text-2xl">{question.question}</p>

        <ul className="space-y-3">
          {question.options.map((option, i) => {
            const isCorrect = i === question.correctIndex;
            const isPicked = selected === i;
            const revealed = selected !== null;
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => submit(i)}
                  disabled={revealed}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors",
                    !revealed && "hover:border-primary/50 hover:bg-secondary",
                    revealed && isCorrect && "border-success bg-success/10",
                    revealed && isPicked && !isCorrect && "border-destructive bg-destructive/10",
                    revealed && !isCorrect && !isPicked && "opacity-60",
                  )}
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">
                    {revealed && isCorrect ? (
                      <Check className="size-4 text-success" />
                    ) : revealed && isPicked ? (
                      <X className="size-4 text-destructive" />
                    ) : (
                      String.fromCharCode(65 + i)
                    )}
                  </span>
                  <span className="text-sm sm:text-base">{option}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {selected !== null && (
          <div className="space-y-4 rounded-xl bg-secondary p-4">
            <p className="text-sm font-semibold">
              {selected === question.correctIndex ? "Correct" : "Not quite"}
            </p>
            {question.explanation && (
              <p className="text-sm text-muted-foreground">{question.explanation}</p>
            )}
            <Button onClick={next} className="w-full rounded-full sm:w-auto">
              {position + 1 < round.length ? "Next question" : "See results"}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
