import { useMutation, useQueryClient } from "@tanstack/react-query";

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
