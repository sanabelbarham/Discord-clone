import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "../App.css";
import { useNavigate } from "react-router-dom";
const socket = io("http://localhost:5000");

function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
const [channel, setChannel] = useState("general");

const handleLogout = () => {
  localStorage.removeItem("user");
  navigate("/register");
};
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

  socket.emit("sendMessage", {
    user,
    text: input,
    channel
  });

  setInput("");
};
const joinChannel = (channelName) => {
  setChannel(channelName);          // update UI state
  setMessages([]);                  // clear old messages (important)

  socket.emit("joinChannel", channelName); // tell backend to switch room
};

  return (
    <div className="app">

     <div className="sidebar">
  <h2>Channels</h2>

  <div className="channel" onClick={() => joinChannel("general")}>
    # general
  </div>

  <div className="channel" onClick={() => joinChannel("gaming")}>
    # gaming
  </div>

  <div className="channel" onClick={() => joinChannel("music")}>
    # music
  </div>
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
          <button onClick={handleLogout}>Logout</button>
        </div>

      </div>
    </div>
  );
}

export default Chat;