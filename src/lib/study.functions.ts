import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { StudySet } from "./study-set";
import { StudySetError } from "./study-set";

export const generateStudySet = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({ input: z.string().trim().min(10).max(12_000) }).parse(data),
  )
  .handler(async ({ data }): Promise<{ ok: true; studySet: StudySet } | { ok: false; message: string; kind: string }> => {
    const { generateStudySetFromAI } = await import("./ai-study.server");
    try {
      const studySet = await generateStudySetFromAI(data.input);
      return { ok: true, studySet };
    } catch (error) {
      if (error instanceof StudySetError) {
        return { ok: false, message: error.message, kind: error.kind };
      }
      return {
        ok: false,
        message: "Something went wrong while generating your study set.",
        kind: "request_failed",
      };
    }
  });
