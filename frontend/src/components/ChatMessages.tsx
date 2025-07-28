interface Message {
  role: "user" | "assistant";
  text: string;
}

interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => (
  <div className="flex flex-col gap-2 p-4 overflow-auto flex-1">
    {messages.map((m, i) => (
      <div
        key={i}
        className={`max-w-[70%] p-3 rounded ${
          m.role === "user" ? "self-end bg-blue-100" : "self-start bg-gray-100"
        }`}
      >
        {m.text}
      </div>
    ))}
  </div>
);

export default ChatMessages;