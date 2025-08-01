import { useChatSessions } from "../hooks/useChatSessions";
import { HiOutlinePencilAlt } from "react-icons/hi";
import React from "react";

const SessionList = ({
  selectedSessionId,
  setSelectedSessionId,
}: {
  selectedSessionId: number | null;
  setSelectedSessionId: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const { data: sessions, isLoading, error } = useChatSessions();

  if (isLoading) {
    return (
      <div className="h-screen border-r border-gray-200 bg-gray-50 p-4">
        <p className="text-gray-500 animate-pulse">Loading sessions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen border-r border-gray-200 bg-gray-50 p-4">
        <p className="text-red-500">Failed to load sessions</p>
      </div>
    );
  }

  return (
    <aside
      className="h-screen border-r border-gray-200 bg-gray-50 p-4"
      aria-label="Session list"
    >
      <button
        onClick={() => {}}
        className="w-full px-1 py-2 text-left text-sm font-lg text-black-600 hover:bg-gray-100 flex"
      >
        <HiOutlinePencilAlt size={20} /> New chat
      </button>
      <div className="px-1 py-1 text-sm text-gray-600 rounded"> Chats </div>
      {sessions?.length === 0 ? (
        <div className="text-sm text-gray-500 italic">
          No sessions yet. Start a conversation to see it here!
        </div>
      ) : (
        <ul className="space-y-1" role="list">
          {sessions?.map((session, index) => {
            const sessionId = session?.id || index;
            const isSelected = selectedSessionId === sessionId;
            const displayName = session?.title?.trim() || `Chat #${index + 1}`;
            return (
              <li
                key={sessionId}
                role="listitem"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setSelectedSessionId(sessionId);
                }}
                className={`px-1 py-1 text-sm rounded cursor-pointer truncate transition-colors duration-150 ${
                  isSelected
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => setSelectedSessionId(sessionId)}
                aria-current={isSelected ? "true" : "false"}
                aria-selected={isSelected}
              >
                {displayName}
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
};

export default SessionList;
