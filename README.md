# # StudySpark AI

Paste study notes or type a topic, and the app generates a structured study set:
a summary with key points, flippable flashcards, and a scored multiple-choice quiz.
The AI is used strictly as a structured-JSON producer — there is no chat surface and
raw model output is never rendered.

## Tech Stack

- React
- TanStack Start
- TypeScript
- Tailwind CSS
- Zod
- OpenRouter API
- OpenAI SDK

## Setup

```bash
bun install     # or: npm install
bun run dev     # http://localhost:8080
```

## Environment Variables

Create a `.env` file in the project root.

```env
OPENROUTER_API_KEY=your_api_key
```

The AI request runs through a TanStack Start server function, so the API key is never exposed to the browser.

## Features

- AI-powered study summary
- Key point extraction
- Interactive flashcards
- Multiple-choice quiz
- Retry incorrect answers
- Loading, error and empty states
- Malformed JSON validation
- Responsive design

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

## AI Usage

- AI Provider: OpenRouter
- Model: openrouter/free
- AI requests are executed through a TanStack Start server function to keep the API key secure.
- The prompt enforces a strict JSON schema.
- Responses are parsed using JSON.parse() and validated with Zod.
- Invalid JSON, malformed responses, request failures, and timeout errors are handled gracefully.
- Older AI responses cannot overwrite newer requests due to stale-request protection.  so the API key never reaches the browser.
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

Approx. 8 hours: schema & error handling (~45m), components and interactions (~1h15m),
design system and responsive polish (~45m), docs and QA (~15m).

## Demo Video
https://drive.google.com/file/d/14WnbHJuKftDxFzrZdiwKxFt9UaEUu1sx/view?usp=sharing
