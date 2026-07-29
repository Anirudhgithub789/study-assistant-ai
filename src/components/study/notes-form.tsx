import { useState } from "react";
import { Loader2, Sparkles, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const EXAMPLES = [
  "The Krebs cycle",
  "Supply and demand basics",
  "React hooks: useState & useEffect",
];

export function NotesForm({
  isLoading,
  onGenerate,
  onClear,
}: {
  isLoading: boolean;
  onGenerate: (input: string) => void;
  onClear: () => void;
}) {
  const [value, setValue] = useState("");

  return (
    <form
      className="card-surface space-y-4 p-5 sm:p-7"
      onSubmit={(e) => {
        e.preventDefault();
        onGenerate(value);
      }}
    >
      <label htmlFor="notes" className="block text-sm font-semibold">
        Your notes or topic
      </label>
      <Textarea
        id="notes"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Paste your study notes here, or type a topic you want to learn…"
        className="min-h-44 resize-y rounded-xl bg-background text-base leading-relaxed sm:min-h-56"
        maxLength={12000}
      />

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">Try:</span>
        {EXAMPLES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => setValue(example)}
            className="rounded-full border px-3 py-1 text-xs transition-colors hover:bg-secondary"
          >
            {example}
          </button>
        ))}
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{value.trim().length} characters</span>
          {value.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-full"
              onClick={() => {
                setValue("");
                onClear();
              }}
            >
              <Trash2 className="size-3.5" /> Clear
            </Button>
          )}
        </div>
        <Button type="submit" size="lg" disabled={isLoading} className="rounded-full sm:min-w-56">
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Generating…
            </>
          ) : (
            <>
              <Sparkles className="size-4" /> Generate study set
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
