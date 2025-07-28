import { useState } from "react";
import ChatInput from "./components/ChatInput";
import ChatMessages from "./components/ChatMessages";
import { parseSSE } from "./utils/parseSSE";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async (question: string) => {
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    const res = await fetch("/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    if (!res.ok) {
      const err = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", text: `Error: ${err.detail || res.status}` }]);
      return;
    }

    // Prepare new assistant message
    const assistantMsg: Message = { role: "assistant", text: "" };
    setMessages((prev) => [...prev, assistantMsg]);

    // Stream in content
    for await (const chunk of parseSSE(res)) {
      console.log("Chunks gotten", chunk);
      assistantMsg.text += chunk;
      setMessages((prev) => [...prev.slice(0, -1), assistantMsg]);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <ChatMessages messages={messages} />
      <ChatInput onSend={sendMessage} />
    </div>
  );
};

export default App;