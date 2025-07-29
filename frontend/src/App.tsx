import { useState } from "react";
import ChatInput from "./components/ChatInput";
import ChatMessages from "./components/ChatMessages";
import DocumentManager from "./components/DocumentManager";
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
      <header className="shadow bg-white p-4 text-xl font-bold text-center">
        ⚡ Smart Document Assistant
      </header>
      <main className="flex-1 container mx-auto p-4 flex flex-col gap-4">
        <div className="flex-1 overflow-y-auto">
          <ChatMessages messages={messages} isLoading={isLoading} />
        </div>
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
        <DocumentManager />  
      </main>
      <footer className="text-center text-sm text-gray-500 py-2 border-t">
        Built with ❤️ using FastAPI, Ollama, and React
      </footer>
    </div>
  );
};

export default App;