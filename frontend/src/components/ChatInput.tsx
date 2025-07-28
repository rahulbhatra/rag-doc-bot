import { useState } from "react";

interface ChatInputProps {
  onSend: (text: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [text, setText] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };
  return (
    <form onSubmit={handleSubmit} className="flex p-2 border-t gap-2">
      <input
        className="flex-grow border rounded px-2 py-1"
        placeholder="Ask a question..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className="btn-primary px-4 py-1">
        Send
      </button>
    </form>
  );
};

export default ChatInput;