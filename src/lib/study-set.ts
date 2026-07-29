import { z } from "zod";

/**
 * Shape of the structured study set the AI must return.
 * Kept deliberately strict — anything else is treated as a bad response.
 */
export const flashcardSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const quizQuestionSchema = z.object({
  question: z.string().min(1),
  options: z.array(z.string().min(1)).min(2).max(6),
  correctIndex: z.number().int().min(0),
  explanation: z.string().optional().default(""),
});

export const studySetSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  keyPoints: z.array(z.string().min(1)).default([]),
  flashcards: z.array(flashcardSchema).min(1),
  quiz: z.array(quizQuestionSchema).min(1),
});

export type Flashcard = z.infer<typeof flashcardSchema>;
export type QuizQuestion = z.infer<typeof quizQuestionSchema>;
export type StudySet = z.infer<typeof studySetSchema>;

export class StudySetError extends Error {
  constructor(
    message: string,
    public readonly kind:
      | "empty"
      | "malformed_json"
      | "bad_structure"
      | "request_failed"
      | "timeout",
  ) {
    super(message);
    this.name = "StudySetError";
  }
}

/** Strips markdown fences / stray prose and grabs the outermost JSON object. */
export function extractJsonObject(raw: string): string {
  const text = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return text;
  return text.slice(start, end + 1);
}

/**
 * Parses + validates an AI payload into a StudySet.
 * Throws a typed StudySetError so the UI can show a precise message.
 */
export function parseStudySet(raw: string | null | undefined): StudySet {
  if (!raw || !raw.trim()) {
    throw new StudySetError("The AI returned an empty response.", "empty");
  }

  let data: unknown;
  try {
    data = JSON.parse(extractJsonObject(raw));
  } catch {
    throw new StudySetError("The AI response was not valid JSON.", "malformed_json");
  }

  const result = studySetSchema.safeParse(data);
  if (!result.success) {
    throw new StudySetError(
      "The AI response was missing required study fields.",
      "bad_structure",
    );
  }

  // Drop quiz questions whose correct index points outside the options list.
  const quiz = result.data.quiz.filter(
    (q) => q.correctIndex >= 0 && q.correctIndex < q.options.length,
  );
  if (quiz.length === 0) {
    throw new StudySetError(
      "The AI response contained no usable quiz questions.",
      "bad_structure",
    );
  }

  return { ...result.data, quiz };
}
