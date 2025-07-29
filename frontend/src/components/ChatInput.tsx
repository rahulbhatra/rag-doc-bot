import { useState } from "react";

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [text, setText] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t bg-white shadow">
      <input
        className="flex-1 border rounded-xl px-4 py-2 focus:outline-none"
        placeholder="Ask anything"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button disabled={isLoading} type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
        Send
      </button>
    </form>
  );
};

export default ChatInput;