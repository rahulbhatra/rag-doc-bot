import { useEffect, useState } from "react";
import ChatInput from "./components/ChatInput";
import ChatMessages, { type Message } from "./components/ChatMessages";
import { useChatQuery } from "./hooks/useChatQuery";
import { useAddMessageToSession, useCreateSession, useSessionMessages } from "./hooks/useChatSessions";
import SessionList from "./components/SessionList";

const App: React.FC = () => {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const { mutate: createSession } = useCreateSession();

  useEffect(() => {
    if (!sessionId) {
      createSession(undefined, {
        onSuccess: (data) => setSessionId(data.id),
      });
    }
  }, [createSession, sessionId]);

  const { data: sessionMessages = [] } = useSessionMessages(sessionId);
  const { mutate: addMessage } = useAddMessageToSession(sessionId);
  const [streamingMessage, setStreamingMessage] = useState<Message | null>(null);

  const { mutate: sendQuery, isPending: isLoading } = useChatQuery((chunk) => {
    const lastMessage = sessionMessages[sessionMessages.length - 1];
    if (lastMessage?.role === "assistant") {
      setStreamingMessage((prev) => {
        if (!prev) return { role: "assistant", text: chunk, timestamp: new Date().toISOString() };
        return { ...prev, text: prev.text + chunk };
      });
    }
  });

  const sendMessage = (question: string) => {
    const userMessage : Message = { role: "user", text: question, timestamp: new Date().toISOString() };
    // const assistantPlaceholder : Message = { role: "assistant", text: "", timestamp: new Date().toISOString() };

    addMessage(userMessage);

    sendQuery({ sessionId, question }, {
      onSuccess: () => {
        // stream response or send final assistant message to backend
        if (streamingMessage) {
          addMessage(streamingMessage);
          setStreamingMessage(null);
        }
      },
      onError: (err) => {
        const errorMsg: Message = { role: "assistant", text: `❌ ${err.message}`, timestamp: new Date().toISOString() };
        addMessage(errorMsg);
        setStreamingMessage(null);
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
        <div>
          <SessionList />
        </div>
        <div className="flex-1 overflow-y-auto">
          <ChatMessages messages={[...sessionMessages, ...(streamingMessage ? [streamingMessage] : [])]} isLoading={isLoading} />
        </div>
        <div className="sticky bottom-0 z-40 bg-gray-50">
          <ChatInput onSend={sendMessage} onStop={() => {}} isLoading={isLoading} /> 
        </div>
      </main>
      <footer className="bg-gray-50 text-center text-sm text-gray-500 py-2 border-t">
        Built with ❤️ using FastAPI, Ollama, and React
      </footer>
    </div>
  );
};

export default App;