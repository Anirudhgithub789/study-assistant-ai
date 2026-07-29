import OpenAI from "openai";
import { parseStudySet, StudySetError, type StudySet } from "./study-set";

const MODEL = "openrouter/free";
const TIMEOUT_MS = 45_000;

const SYSTEM_PROMPT = `You are a study-set generator.

Respond ONLY with a valid JSON object.

No markdown.
No explanations.
No code fences.

Schema:

{
  "title": string,
  "summary": string,
  "keyPoints": string[],
  "flashcards": [
    {
      "question": string,
      "answer": string
    }
  ],
  "quiz": [
    {
      "question": string,
      "options": string[],
      "correctIndex": number,
      "explanation": string
    }
  ]
}`;

export async function generateStudySetFromAI(
  input: string,
): Promise<StudySet> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new StudySetError(
      "The AI service is not configured.",
      "request_failed",
    );
  }

  const client = new OpenAI({
  apiKey,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:8080",
    "X-Title": "StudySpark AI",
  },
});

  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, TIMEOUT_MS);

  try {
    const completion = await client.chat.completions.create(
      {
        model: MODEL,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: input,
          },
        ],
        response_format: {
          type: "json_object",
        },
      },
      {
        signal: controller.signal,
      },
    );

    clearTimeout(timer);

    const text = completion.choices[0]?.message?.content;

    return parseStudySet(text);
  } catch (error) {
    clearTimeout(timer);

    console.error("OpenRouter Error:", error);

    if (error instanceof Error && error.name === "AbortError") {
      throw new StudySetError(
        "The AI took too long to respond.",
        "timeout",
      );
    }

    throw new StudySetError(
      "Could not reach the AI service.",
      "request_failed",
    );
  }
}