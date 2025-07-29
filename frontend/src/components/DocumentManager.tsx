import { useRef, useState, useEffect } from "react";
import { useUploadDocument } from "../hooks/useUploadDocument";

export default function DocumentManager() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<string[]>([]);
  const { mutate: uploadDocument } = useUploadDocument();

  const fetchFiles = async () => {
    const res = await fetch("/upload");
    const data = await res.json();
    setFiles(data.files);
  };

  const handleUpload = () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    uploadDocument(file, {
      onSuccess: () => fetchFiles(),
    });
  };

  const handleDelete = async (filename: string) => {
    await fetch(`/upload/${filename}`, { method: "DELETE" });
    fetchFiles();
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="p-4 border rounded shadow-md w-full max-w-xl mx-auto bg-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Manage Documents</h2>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-500 text-white text-xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-600 transition"
          title="Upload Document"
        >
          +
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      <ul className="space-y-2">
        {files.map((file) => (
          <li
            key={file}
            className="flex justify-between items-center bg-gray-100 p-2 rounded"
          >
            <span>{file}</span>
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