import { useMutation } from "@tanstack/react-query";

export const useChatQuery = () => {
  return useMutation({
    mutationFn: async (question: string) => {
      const res = await fetch("/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || res.statusText);
      }

      const data = await res.json();
      return data.answer;
    },
  });
};