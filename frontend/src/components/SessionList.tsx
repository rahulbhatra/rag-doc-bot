import { useChatSessions } from "../hooks/useChatSessions";
import React from "react";

const SessionList = ({ selectedSessionId, setSelectedSessionId } : { selectedSessionId: number | null, setSelectedSessionId: React.Dispatch<React.SetStateAction<number | null>> }) => {
  const { data: sessions, isLoading, error } = useChatSessions();

  if (isLoading) {
    return (
      <div className="w-[10%] min-w-[120px] h-screen border-r border-gray-200 bg-gray-50 p-4">
        <p className="text-gray-500 animate-pulse">Loading sessions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-[10%] min-w-[120px] h-screen border-r border-gray-200 bg-gray-50 p-4">
        <p className="text-red-500">Failed to load sessions</p>
      </div>
    );
  }

  return (
    <aside className="w-[10%] min-w-[120px] h-screen border-r border-gray-200 bg-gray-50 p-4" aria-label="Session list">
      <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">History</h2>
      <ul className="space-y-2">
        {sessions?.map((session, index) => {
          const sessionId = session?.id || index;
          const isSelected = selectedSessionId === sessionId;
          const displayName = session?.title?.trim() || `Session #${index + 1}`;
          return (
            <li
              key={sessionId}
              className={`px-3 py-2 text-sm rounded cursor-pointer truncate transition-colors duration-150 ${
                isSelected ? "bg-blue-100 text-blue-700 font-medium" : "hover:bg-gray-200"
              }`}
              onClick={() => setSelectedSessionId(sessionId)}
              aria-current={isSelected ? "true" : "false"}
            >
              {displayName}
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default SessionList;