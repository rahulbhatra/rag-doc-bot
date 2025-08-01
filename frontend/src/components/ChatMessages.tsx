import ReactMarkdown from "react-markdown";

export interface Message {
  session_id: number | null;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isLoading }) => {
  return (
    <div className="flex flex-col gap-3 px-4 py-4 overflow-y-auto">
      {messages.map((message, idx) => (
        <div key={idx}>
          {message.text && (
            <div
              className={`w-fit rounded-2xl px-4 py-2 whitespace-pre-wrap break-words text-sm shadow-sm ${
                message.role === "user"
                  ? "bg-blue-100 self-end text-right"
                  : "bg-gray-100 self-start text-left"
              }`}
            >
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          )}
        </div>
      ))}
      {isLoading && (
        <div className="flex items-center space-x-2 my-2">
          <div className="bg-gray-100 p-3 rounded-xl max-w-sm animate-pulse">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
