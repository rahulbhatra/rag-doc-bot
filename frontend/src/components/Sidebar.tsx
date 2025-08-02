import {
  useChatSessions,
  useCreateSession,
  useDeleteSession,
} from "../hooks/useChatSessions";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { MdDeleteOutline } from "react-icons/md";
import React from "react";
import { FaBars } from "react-icons/fa";

const Sidebar = ({
  selectedSessionId,
  setSelectedSessionId,
  sidebarOpen,
  setSidebarOpen,
}: {
  selectedSessionId: number | null;
  setSelectedSessionId: React.Dispatch<React.SetStateAction<number | null>>;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { data: sessions, isLoading, error } = useChatSessions();
  const { mutate: deleteSessionMutation } = useDeleteSession();
  const { mutate: createSession } = useCreateSession();

  const handleCreateSession = () => {
    createSession("", {
      onSuccess: (session) => {
        setSelectedSessionId(session.id);
      },
    });
  };

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
      className="h-screen border-r border-gray-200 bg-gray-50 px-2"
      aria-label="Session list"
    >
      <div className="sticky top-0 z-50 bg-gray-50">
        <button
          onClick={() => {
            setSidebarOpen((prev) => !prev);
          }}
          className="w-full px-1 py-2 text-left text-sm font-lg text-black-600 hover:bg-gray-100 flex"
        >
          <FaBars size={20} />
        </button>
        <button
          onClick={handleCreateSession}
          className="w-full px-1 py-2 text-left text-sm font-lg text-black-600 hover:bg-gray-100 flex"
        >
          <HiOutlinePencilAlt size={20} /> {sidebarOpen && "New chat"}
        </button>
      </div>
      {sidebarOpen && (
        <div>
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
                const displayName =
                  session?.title?.trim() || `Chat #${index + 1}`;
                return (
                  <li
                    key={sessionId}
                    role="listitem"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setSelectedSessionId(sessionId);
                    }}
                    className={`px-2 py-2 text-sm rounded cursor-pointer truncate transition-colors duration-150 ${
                      isSelected
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedSessionId(sessionId)}
                    aria-current={isSelected ? "true" : "false"}
                    aria-selected={isSelected}
                  >
                    <div className="flex flex-row justify-between">
                      {displayName}
                      <button
                        className="transition-colors duration-150 hover:bg-gray-500 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSessionMutation(sessionId);
                        }}
                      >
                        <MdDeleteOutline size={20} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
