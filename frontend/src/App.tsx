import { useState } from "react";
import ChatInput from "./components/ChatInput";
import ChatMessages from "./components/ChatMessages";
import { useChatQuery } from "./hooks/useChatQuery";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const { mutate: sendQuery, isPending: isLoading } = useChatQuery((chunk) => {
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      const updated = { ...last, text: last.text + chunk };
      return [...prev.slice(0, -1), updated];
    });
  });

  const sendMessage = (question: string) => {
    setMessages((prev) => [...prev, { role: "user", text: question }, { role: "assistant", text: "" }]);

    sendQuery(question, {
      onError: (err) => {
        setMessages((prev) => [...prev.slice(0, -1), { role: "assistant", text: `❌ ${err.message}` }]);
      },
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 bg-gray-50 shadow-sm border-b">
        <div className="mx-auto px-3 py-1 flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-200 text-white rounded-full p-2 text-lg font-bold">
              ⚡
            </div>
            <span className="text-l font-semibold text-gray-600 tracking-tight">
              Smart Document Assistant
            </span>
          </div>

          {/* Right-side Navigation (Optional - Replace or Extend) */}
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#chat" className="hover:text-blue-600 transition">Chat</a>
            <a href="#upload" className="hover:text-blue-600 transition">Documents</a>
            <a
              href="https://github.com/rahulbhatra/rag-doc-bot"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4 flex flex-col gap-4 overflow-auto px-4 py-2">
        <div className="flex-1 overflow-y-auto">
          <ChatMessages messages={messages} isLoading={isLoading} />
        </div>
        <div className="sticky bottom-0 z-40 bg-gray-50">
          <ChatInput onSend={sendMessage} isLoading={isLoading} /> 
        </div>
      </main>
      <footer className="bg-gray-50 text-center text-sm text-gray-500 py-2 border-t">
        Built with ❤️ using FastAPI, Ollama, and React
      </footer>
    </div>
  );
};

export default App;