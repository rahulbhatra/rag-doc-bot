
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
  <div className="...">
    {messages.map((message, idx) => (
      <div>
        { message.text && (
          <div
            key={idx}
            className={`p-3 rounded-xl max-w-[80%] ${
              message.role === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 text-gray-900 self-start"
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