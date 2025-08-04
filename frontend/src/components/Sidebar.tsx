import {
  useChatSessions,
  useCreateSession,
  useDeleteSession,
  useRenameSession,
} from "../hooks/useChatSessions";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { MdDeleteOutline, MdDriveFileRenameOutline } from "react-icons/md";
import React, { useEffect, useState } from "react";
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
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const [contextSessionId, setContextSessionId] = useState<number | null>(null);
  console.log(contextSessionId);
  const [renameEnabled, setRenameEnabled] = useState<boolean>(false);
  const [tempTitle, setTempTitle] = useState<string>();
  const { data: sessions, isLoading, error } = useChatSessions();
  const { mutate: deleteSessionMutation } = useDeleteSession();
  const { mutate: createSession } = useCreateSession();
  const { mutate: renameSession } = useRenameSession();

  const handleRename = (sessionId: number, newName: string) => {
    renameSession(
      { sessionId, newName },
      {
        onSuccess: () => {
          setRenameEnabled(false);
          setContextSessionId(null);
        },
      },
    );
  };

  const handleRightClick = (e: React.MouseEvent, sessionId: number) => {
    e.preventDefault();
    setMenuVisible(true);
    setContextSessionId(sessionId);
    setMenuPos({ x: e.pageX, y: e.pageY });
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClick = () => {
      setMenuVisible(false);
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

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
          <div className="px-1 py-2 text-m text-gray-600 rounded"> Chats </div>
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
                  <div>
                    <li
                      key={sessionId}
                      role="listitem"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") setSelectedSessionId(sessionId);
                      }}
                      onContextMenu={(e) => handleRightClick(e, sessionId)}
                      className={`px-2 py-2 text-sm rounded cursor-pointer truncate transition-colors duration-150 ${
                        isSelected
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "hover:bg-gray-200"
                      }`}
                      onClick={() => setSelectedSessionId(sessionId)}
                      aria-current={isSelected ? "true" : "false"}
                      aria-selected={isSelected}
                    >
                      {contextSessionId === session.id && renameEnabled ? (
                        <input
                          className="w-full px-2 py-1 text-sm border rounded"
                          autoFocus
                          value={tempTitle}
                          onChange={(e) => setTempTitle(e.target.value)}
                          onBlur={() =>
                            handleRename(session.id, tempTitle ?? "")
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter")
                              handleRename(session.id, tempTitle ?? "");
                            if (e.key === "Escape") {
                              setTempTitle(session.title);
                              setContextSessionId(null);
                            }
                          }}
                        />
                      ) : (
                        <div>{displayName}</div>
                      )}
                    </li>
                  </div>
                );
              })}
              {menuVisible && (
                <ul
                  className="absolute bg-white border shadow-md rounded text-sm w-36 z-50"
                  style={{ top: menuPos.y, left: menuPos.x }}
                >
                  <li
                    className="flex px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      const contextSession = sessions?.find(
                        (s) => s.id === contextSessionId,
                      );
                      if (!contextSession) {
                        return;
                      }
                      setMenuVisible(false);
                      setTempTitle(contextSession.title);
                      setRenameEnabled(true);
                    }}
                  >
                    <MdDriveFileRenameOutline size={20} /> Rename
                  </li>
                  <li
                    className="flex px-3 py-2 text-red-600 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      const contextSession = sessions?.find(
                        (s) => s.id === contextSessionId,
                      );
                      if (!contextSession) {
                        return;
                      }
                      setMenuVisible(false);
                      deleteSessionMutation(contextSession.id);
                    }}
                  >
                    <MdDeleteOutline size={20} />
                    Delete
                  </li>
                </ul>
              )}
            </ul>
          )}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
