// hooks/useChatQuery.ts
import { useMutation } from "@tanstack/react-query";

export const useChatQuery = (onChunk?: (chunk: string) => void) => {
  return useMutation({
    mutationFn: async (question: string) => {
      const res = await fetch("/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!res.ok || !res.body) {
        throw new Error("Failed to fetch stream");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          if (part.startsWith("data:")) {
            const jsonStr = part.replace(/^data:\s*/, "");
            try {
              const data = JSON.parse(jsonStr);
              onChunk?.(data.answer ?? "");
            } catch {
              onChunk?.(jsonStr); // fallback plain text
            }
          }
        }
      }

      return true;
    },
  });
};