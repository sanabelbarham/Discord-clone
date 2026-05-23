import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "../App.css";

const socket = io("http://localhost:5000"); // ✅ ONLY ONCE

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const user = JSON.parse(localStorage.getItem("user"))?.username;

  useEffect(() => {
    socket.on("loadMessages", (data) => {
      setMessages(data);
    });

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("loadMessages");
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    const messageData = {
      user: user || "Guest",
      text: input
    };

    socket.emit("sendMessage", messageData); // ✅ SAME SOCKET

    setInput("");
  };

  return (
    <div className="app">

      <div className="sidebar">
        <h2>Channels</h2>
        <div className="channel"># general</div>
      </div>

      <div className="chat">

        <div className="messages">
          {messages.map((msg, i) => (
            <div key={i}>
              <b>{msg.user}:</b> {msg.text}
            </div>
          ))}
        </div>

        <div className="input-area">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button onClick={sendMessage}>
            Send
          </button>
        </div>

      </div>
    </div>
  );
}

export default Chat;