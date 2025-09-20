import { useEffect, useState } from "react";

export default function ChatOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [sessionId, setSessionId] = useState("default");

  useEffect(()=>{
    setSessionId(sessionStorage.getItem("session_id"));
  },[])
  const sendMessage = async () => {
    if (!message.trim()) return;

    const newHistory = [...history, { role: "user", parts: message }];
    setHistory(newHistory);

    try {
      const res = await fetch(`${process.env.SERVER_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message,
          session_id: sessionId,
        }),
      });
      setMessage("");
      const data = await res.json();
      if (data.reply) {
        setHistory([...newHistory, { role: "model", parts: data.reply }]);
      }
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="chat-toggle-btn"
      >
        {isOpen ? "Close Chat" : "Chat"}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-messages">
            {history.map((msg, i) => (
              <div
                key={i}
                className={msg.role === "user" ? "chat-user-msg" : "chat-bot-msg"}
              >
                {msg.parts}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
