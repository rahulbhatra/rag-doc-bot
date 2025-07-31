

import React from "react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

interface ChatWindowProps {
  messages: Message[];
  isLoading?: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  return (
    <div className="flex flex-col gap-2 p-4 overflow-y-auto flex-1">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`max-w-xl px-4 py-2 rounded-xl ${
            msg.role === "user"
              ? "bg-blue-100 self-end"
              : "bg-gray-200 self-start"
          }`}
        >
          {msg.text}
        </div>
      ))}
      {isLoading && (
        <div className="text-sm text-gray-500 italic self-start">Thinking...</div>
      )}
    </div>
  );
};

export default ChatWindow;