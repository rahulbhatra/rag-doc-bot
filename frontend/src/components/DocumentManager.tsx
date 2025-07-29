import { useEffect, useState } from "react";
import { useUploadDocument } from "../hooks/useUploadDocument";
// import { toast } from "react-toastify"; // Uncomment if using toast

export default function DocumentManager() {
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { mutate: uploadDocument, isPending: isLoading } = useUploadDocument();

  const fetchFiles = async () => {
    try {
      const res = await fetch("/upload");
      const data = await res.json();
      setFiles(data.files);
    } catch (err) {
      console.error("Failed to fetch files", err);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      // toast.error("Please select a file to upload.");
      return;
    }

    // toast.loading("Uploading...", { id: "upload" });

    uploadDocument(selectedFile, {
      onSuccess: () => {
        // toast.success("✅ Upload successful!", { id: "upload" });
        fetchFiles();
        setSelectedFile(null);
      },
      onError: (err: unknown) => {
        // toast.error(`❌ ${err.message || "Upload failed"}`, { id: "upload" });
        console.error("Upload failed", err);
      },
    });
  };

  const handleDelete = async (filename: string) => {
    try {
      await fetch(`/upload/${filename}`, { method: "DELETE" });
      fetchFiles();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="p-4 border rounded shadow-md w-full max-w-xl mx-auto bg-white">
      <h2 className="text-xl font-semibold mb-4">Manage Documents</h2>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleUpload}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? "Uploading..." : "Upload"}
        </button>
      </div>

      <ul className="space-y-2">
        {files.map((file) => (
          <li
            key={file}
            className="flex justify-between items-center bg-gray-100 p-2 rounded"
          >
            <span className="truncate">{file}</span>
            <button
              onClick={() => handleDelete(file)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}