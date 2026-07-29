# Study Assistant

Paste study notes or type a topic, and the app generates a structured study set:
a summary with key points, flippable flashcards, and a scored multiple-choice quiz.
The AI is used strictly as a structured-JSON producer — there is no chat surface and
raw model output is never rendered.

## Setup

```bash
bun install     # or: npm install
bun run dev     # http://localhost:8080
```

Requires a `LOVABLE_API_KEY` environment variable (provided automatically on Lovable Cloud)
for the AI request, which runs server-side only.

## Project structure

```
src/
  routes/index.tsx                 Page composition (hero, form, sections)
  components/study/
    notes-form.tsx                 Textarea + generate button
    summary-panel.tsx              Title, summary, key points
    flashcard-deck.tsx             One card at a time, flip + prev/next
    quiz.tsx                       One question at a time, scoring, retry-incorrect
    study-states.tsx               Loading / error / empty states
  hooks/use-study-set.ts           Generation state + stale-response guard
  lib/study-set.ts                 Zod schema, JSON extraction, typed errors
  lib/study.functions.ts           Server function boundary
  lib/ai-study.server.ts           AI call (server-only)
```

Business logic (validation, parsing, request handling) lives in `lib/` and `hooks/`;
components stay presentational.

## AI usage note

- Model: `openai/gpt-5.6-sol` via the Lovable AI Gateway, called from a server function
  so the API key never reaches the browser.
- The prompt pins an exact JSON schema and `response_format: json_object`.
- Responses are fence-stripped, `JSON.parse`d, then validated with Zod. Malformed JSON,
  wrong structure, empty content, non-2xx responses, and a 45s timeout each map to a
  typed error with a user-facing message and a retry action.
- Concurrent generations are versioned with a request counter, so a slow older response
  can never overwrite a newer one.
- Quiz items whose `correctIndex` falls outside their options are dropped before render.

## Known limitations

- No persistence: refreshing clears the current study set.
- One study set at a time; no history or export.
- Very long notes are truncated at 12,000 characters.
- Content accuracy depends entirely on the model; no fact-checking layer.
- Flashcard/quiz counts are prompt-guided, not strictly enforced beyond minimums.

## Time spent

Approx. 3 hours: schema & error handling (~45m), components and interactions (~1h15m),
design system and responsive polish (~45m), docs and QA (~15m).
