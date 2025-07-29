import { useEffect, useState } from "react";
import UploadButton from "./UploadButton";
import Files from "./Files";

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  const fetchFiles = async () => {
    try {
      const res = await fetch("/upload");
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err) {
      console.error("Failed to fetch files:", err);
    }
  };

  const handleDelete = async (filename: string) => {
    try {
      await fetch(`/upload/${filename}`, { method: "DELETE" });
      fetchFiles();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-4 border-t bg-white shadow-md"
    >
      {/* Uploaded Files List */}
      <Files files={files} onDelete={handleDelete} />

      {/* Input + Send */}
      <div className="flex flex-col md:flex-row gap-2 w-full">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="Ask anything"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition"
        >
          Send
        </button>
        {/* Upload Button */}
        <div className="md:w-auto">
          <UploadButton fetchFiles={fetchFiles} />
        </div>
      </div>
    </form>
  );
};

export default ChatInput;