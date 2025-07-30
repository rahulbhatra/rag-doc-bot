
interface Message {
  role: "user" | "assistant";
  text: string;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

interface Message { role: 'user' | 'assistant'; text: string; }

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isLoading }) => (
  <div className="flex flex-col gap-3 px-4 py-4 overflow-y-auto max-h-[calc(100vh-300px)]">
    {messages.map((message, idx) => (
      <div>
        { message.text && (
          <div
            key={idx}
            className={`w-fit rounded-2xl px-4 py-2 max-w-2xl whitespace-pre-wrap break-words text-sm shadow-sm ${
              message.role === "user"
                ? "bg-blue-100 self-end text-right"
                : "bg-gray-100 self-start text-left"
            }`}
          >
          { message.text }
        </div>
        )}
      </div>
    ))}
    {isLoading && (
      <div className="self-start p-3 bg-gray-100 text-gray-600 rounded-xl animate-pulse">
        Typing...
      </div>
    )}
  </div>
);

export default ChatMessages;