import { useRef, useState } from "react";
import ChatInput from "./components/ChatInput";
import ChatMessages, { type Message } from "./components/ChatMessages";
import { useChatQuery } from "./hooks/useChatQuery";
import {
  useAddMessageToSession,
  useSessionMessages,
} from "./hooks/useChatSessions";
import Sidebar from "./components/Sidebar";
import ragBotLogo from "./assets/rag-doc-bot.png";

const App: React.FC = () => {
  const [sessionId, setSessionId] = useState<number | null>(null);

  const { data: sessionMessages = [] } = useSessionMessages(sessionId);
  const { mutate: addMessage } = useAddMessageToSession();
  const [streamingMessage, setStreamingMessage] = useState<Message | null>(
    null,
  );
  const streamingMessageRef = useRef<Message | null>(null);

  const { mutate: sendQuery, isPending: isLoading } = useChatQuery((chunk) => {
    setStreamingMessage((prev) => {
      const updated = {
        role: "assistant" as const,
        text: (prev?.text ?? "") + chunk,
        timestamp: new Date().toISOString(),
        session_id: null,
      };
      streamingMessageRef.current = updated;
      return updated;
    });
  });

  const sendMessage = (question: string, sessionId: number | null) => {
    const userMessage: Message = {
      session_id: sessionId,
      role: "user",
      text: question,
      timestamp: new Date().toISOString(),
    };

    addMessage({ sessionId, message: userMessage });

    sendQuery(
      { sessionId, question },
      {
        onSuccess: async () => {
          const finalMsg = streamingMessageRef.current;
          const errorMsg: Message = {
            role: "assistant",
            text: `❌ ${"Some issue"}`,
            timestamp: new Date().toISOString(),
            session_id: null,
          };
          await addMessage({ sessionId, message: finalMsg ?? errorMsg });
          streamingMessageRef.current = null;
          setStreamingMessage(null);
        },
        onError: async (err) => {
          const errorMsg: Message = {
            role: "assistant",
            text: `❌ ${err.message}`,
            timestamp: new Date().toISOString(),
            session_id: null,
          };
          await addMessage({ sessionId, message: errorMsg });
          setStreamingMessage(null);
        },
        onSettled: () => {},
      },
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 bg-gray-50 shadow-sm">
        <div className="mx-auto px-3 py-1 flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-200 text-white text-lg font-bold">
              <img
                src={ragBotLogo}
                alt="RAG Doc Bot Logo"
                className="h-10 w-auto"
              />
            </div>
            <span className="text-l font-extrabold text-gay-600 tracking-wide drop-shadow-sm animate-pulse">
              DragonAssist
            </span>
          </div>

          {/* Right-side Navigation (Optional - Replace or Extend) */}
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#chat" className="hover:text-blue-600 transition">
              Chat
            </a>
            <a href="#upload" className="hover:text-blue-600 transition">
              Documents
            </a>
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
      <main className="flex-1 flex flex-row">
        <div className="w-full sm:w-[30%] md:w-[20%] lg:w-[15%] h-[calc(100vh-85px)] overflow-y-auto border-r border-gray-200">
          <Sidebar
            selectedSessionId={sessionId}
            setSelectedSessionId={setSessionId}
          />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden h-[calc(100vh-90px)] relative">
          <div className="flex-1 overflow-y-auto pb-4">
            <ChatMessages
              messages={[
                ...sessionMessages,
                ...(streamingMessage ? [streamingMessage] : []),
              ]}
              isLoading={isLoading}
            />
          </div>
          <div className="sticky bottom-0 w-full bg-gray-50 z-40 flex-shrink-0">
            <ChatInput
              sessionId={sessionId}
              onSend={sendMessage}
              onStop={() => {}}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
      <footer className="sticky bottom-0 z-50 bg-gray-50 text-center text-sm text-gray-500 py-2">
        Built with ❤️ using FastAPI, Ollama, and React
      </footer>
    </div>
  );
};

export default App;
