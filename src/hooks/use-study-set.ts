import { useCallback, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";

import { generateStudySet } from "@/lib/study.functions";
import type { StudySet } from "@/lib/study-set";

export type GenerationStatus = "idle" | "loading" | "success" | "error";

/**
 * Owns all study-set generation state and guards against out-of-order
 * responses: only the most recent request is allowed to update the UI.
 */
export function useStudySet() {
  const callGenerate = useServerFn(generateStudySet);
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [studySet, setStudySet] = useState<StudySet | null>(null);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const generate = useCallback(
    async (input: string) => {
      const trimmed = input.trim();
      if (trimmed.length < 10) {
        setStatus("error");
        setError("Add a bit more detail — at least 10 characters of notes or a topic.");
        return;
      }

      const requestId = ++requestIdRef.current;
      setStatus("loading");
      setError(null);

      try {
        const result = await callGenerate({ data: { input: trimmed } });
        if (requestId !== requestIdRef.current) return; // stale response, ignore

        if (result.ok) {
          setStudySet(result.studySet);
          setStatus("success");
        } else {
          setError(result.message);
          setStatus("error");
        }
      } catch {
        if (requestId !== requestIdRef.current) return;
        setError("The request failed. Check your connection and try again.");
        setStatus("error");
      }
    },
    [callGenerate],
  );

  const reset = useCallback(() => {
    requestIdRef.current++;
    setStatus("idle");
    setStudySet(null);
    setError(null);
  }, []);

  return { status, studySet, error, generate, reset };
}
