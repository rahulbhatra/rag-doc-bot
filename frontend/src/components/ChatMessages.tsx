import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: "user" | "assistant";
  text: string;
}

interface ChatMessagesProps {
  messages: Message[];
}

interface Message { role: 'user' | 'assistant'; text: string; }

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => (
  <div className="...">
    {messages.map((m, idx) => (
      <div key={idx} className="...">
        {m.role === 'assistant' ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {m.text}
          </ReactMarkdown>
        ) : (
          <p>{m.text}</p>
        )}
      </div>
    ))}
  </div>
);

export default ChatMessages;