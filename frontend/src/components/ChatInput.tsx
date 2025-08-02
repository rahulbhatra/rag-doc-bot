import { useEffect, useRef, useState } from "react";
import UploadButton from "./UploadButton";
import Files from "./Files";
import { FaSpinner, FaCheckCircle, FaStop } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import {
  useUploadDocument,
  useSessionDocuments,
} from "../hooks/useChatSessionDocuments";

interface ChatInputProps {
  sessionId: number | null;
  onSend: (text: string, sessionId: number | null) => void;
  onStop: () => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  sessionId,
  onSend,
  onStop,
  isLoading,
}) => {
  const [text, setText] = useState("");
  const { data: files = [] } = useSessionDocuments(sessionId);
  const abortRef = useRef<AbortController | null>(null);
  const [uploadedChunkMessage, setUploadedChunkMessage] = useState<
    string | null
  >(null);

  const {
    mutate: uploadDocument,
    isPending: isUploadPending,
    data,
  } = useUploadDocument();

  useEffect(() => {
    if (data?.chunks) {
      const text = `${data.chunks} chunks extracted`;
      setUploadedChunkMessage(text);
      const timeout = setTimeout(() => setUploadedChunkMessage(null), 3000); // hide after 3 seconds
      return () => clearTimeout(timeout); // cleanup
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim(), sessionId);
    setText("");
  };

  const handleStop = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      onStop();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col px-4 py-2 bg-gray-100 shadow-md rounded-2xl"
    >
      <div className="flex flex-col items-start gap-1">
        {isUploadPending && (
          <div className="flex items-center gap-2 text-blue-600 text-sm">
            <FaSpinner className="animate-spin" />
            <span>Uploading & Processing...</span>
          </div>
        )}

        {uploadedChunkMessage && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <FaCheckCircle />
            <span>{uploadedChunkMessage}</span>
          </div>
        )}
      </div>

      {/* Uploaded Files List */}
      <Files sessionId={sessionId} files={files} />

      {/* Input + Send */}
      <div className="flex flex-col md:flex-row gap-2 w-full">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="Ask anything"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {isLoading ? (
          <button
            type="button"
            onClick={handleStop}
            className="bg-gray-600 hover:bg-gray-700 text-white w-10 h-10 flex items-center justify-center rounded-full transition"
          >
            <FaStop className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white p-2 hover:bg-blue-700 disabled:opacity-100 w-10 h-10 flex items-center justify-center rounded-full transition"
          >
            <FiSend className="w-4 h-4" />
          </button>
        )}
        {/* Upload Button */}
        <div className="flex items-center justify-center">
          <UploadButton sessionId={sessionId} uploadDocument={uploadDocument} />
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
