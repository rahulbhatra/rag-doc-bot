import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Message } from "../components/ChatMessages";

export interface ChatSession {
  id: number;
  title: string;
  created_at: string;
  messages: Message[];
}

export const useChatSessions = () => {
  return useQuery<ChatSession[]>({
    queryKey: ["sessions"],
    queryFn: async () => {
      const res = await fetch("/sessions");
      if (!res.ok) throw new Error("Failed to fetch sessions");
      return res.json();
    },
  });
};

export const useCreateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (title?: string) => {
      const res = await fetch("/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: title ? JSON.stringify({ title }) : null,
      });
      if (!res.ok) throw new Error("Failed to create session");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
};

export const useDeleteSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sessionId: number) => {
      const res = await fetch(`/sessions/${sessionId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete session failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
};

export const useRenameSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessionId,
      newName,
    }: {
      sessionId: number;
      newName: string;
    }) => {
      const res = await fetch(`/sessions/${sessionId}/rename`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newName }),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(`Failed to rename session: ${error}`);
      }

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
};

export const useSessionMessages = (sessionId: number | null) => {
  return useQuery({
    queryKey: ["sessionMessages", sessionId],
    enabled: !!sessionId,
    queryFn: async () => {
      const res = await fetch(`/sessions/${sessionId}/messages`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    },
  });
};

export const useAddMessageToSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      sessionId,
      message,
    }: {
      sessionId: number | null;
      message: Message;
    }) => {
      const res = await fetch(`/sessions/${sessionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...message,
          session_id: sessionId, // ✅ Include this in the body
        }),
      });
      if (!res.ok) throw new Error("Failed to send message");
      return res.json();
    },
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({
        queryKey: ["sessionMessages", sessionId],
      });
    },
  });
};
