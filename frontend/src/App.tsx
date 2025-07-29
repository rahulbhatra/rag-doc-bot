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

  const { mutate: sendQuery, isPending: isLoading } = useChatQuery();

  const sendMessage = (question: string) => {
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    sendQuery(question, {
      onSuccess: (answer) => {
        setMessages((prev) => [...prev, { role: "assistant", text: answer }]);
      },
      onError: (err) => {
        setMessages((prev) => [...prev, { role: "assistant", text: `❌ ${err.message}` }]);
      },
    });
  };

  return (
    <div>
      <header className="shadow bg-white p-4 text-xl font-bold text-center">
        ⚡ Smart Document Assistant
      </header>
      <main className="flex-1 container mx-auto p-4">
        <ChatMessages messages={messages} isLoading={isLoading} />
        <ChatInput onSend={sendMessage} />
        <DocumentManager />  
      </main>
      <footer className="text-center text-sm text-gray-500 py-2 border-t">
        Built with ❤️ using FastAPI, Ollama, and React
      </footer>
    </div>
  );
};

export default App;