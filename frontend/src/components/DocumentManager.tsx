import { useEffect, useState } from "react";

export default function DocumentManager() {
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchFiles = async () => {
    const res = await fetch("/upload");
    const data = await res.json();
    setFiles(data.files);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);

    await fetch("/upload", {
      method: "POST",
      body: formData,
    });
    setSelectedFile(null);
    fetchFiles();
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
      <h2 className="text-xl font-semibold mb-4">Manage Documents</h2>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
          className="border p-2 rounded"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Upload
        </button>
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