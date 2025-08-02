import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useUploadDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      sessionId,
      file,
    }: {
      sessionId: number | null;
      file: File;
    }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("session_id", sessionId?.toString() ?? "");

      const res = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Upload failed");
      }

      return await res.json();
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["documents", vars.sessionId] });
    },
  });
}

export type UploadedFile = {
  filename: string;
  size: number;
  uploaded_at: string;
};

export function useSessionDocuments(sessionId: number | null) {
  return useQuery<UploadedFile[]>({
    // Unique query key scoped by sessionId
    queryKey: ["documents", sessionId],
    queryFn: async () => {
      const res = await fetch(`/upload?session_id=${sessionId}`);
      if (!res.ok) throw new Error("Failed to fetch files");
      const data = await res.json();
      return data.files ?? [];
    },
    // Don't run without a valid session
    enabled: sessionId != null,
    retry: false, // avoid retry loops
    staleTime: 1000 * 60 * 2, // Cache fresh for 2 minutes
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessionId,
      filename,
    }: {
      sessionId: number;
      filename: string;
    }) => {
      const url = `/upload?session_id=${sessionId}&filename=${encodeURIComponent(filename)}`;
      const res = await fetch(url, { method: "DELETE" });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Delete failed");
      }

      return await res.json();
    },
    onSuccess: (_data, vars) => {
      // Invalidate files for that session
      queryClient.invalidateQueries({
        queryKey: ["documents", vars.sessionId],
      });
    },
  });
}
