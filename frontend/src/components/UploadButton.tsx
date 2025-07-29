import { useRef, useEffect } from "react";
import { useUploadDocument } from "../hooks/useUploadDocument";

interface Props {
  fetchFiles: () => Promise<void>
}

export default function UploadButton({ fetchFiles }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: uploadDocument } = useUploadDocument();

  const handleUpload = () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    uploadDocument(file, {
      onSuccess: () => fetchFiles(),
    });
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="flex items-center justify-between mb-4">
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
  );
}