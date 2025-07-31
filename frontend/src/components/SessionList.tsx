

import { useChatSessions } from "../hooks/useChatSessions";

const SessionList = () => {
  const { data: sessions, isLoading, error } = useChatSessions();

  if (isLoading) return <div className="p-4 text-gray-500">Loading sessions...</div>;
  if (error) return <div className="p-4 text-red-500">Failed to load sessions</div>;

  return (
    <div className="p-4 border rounded bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Chat Sessions</h2>
      <ul className="space-y-2">
        {sessions?.map((session, index) => (
          <li key={index} className="p-2 border rounded hover:bg-gray-100 cursor-pointer">
            Session #{index + 1} — {session.messages[0]?.timestamp?.slice(0, 10) || "Unknown Date"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SessionList;