import { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";


const socket = io("http://localhost:5000");

function App() {


  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");


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

    if (input.trim() === "") return;

    const messageData = {
      user: "You",
      text: input
    };

   
    socket.emit("sendMessage", messageData);


    setInput("");
  };

  return (
    <div className="app">

      {/* Sidebar */}
      <div className="sidebar">
        <h2>Channels</h2>

        <div className="channel"># general</div>
        <div className="channel"># gaming</div>
        <div className="channel"># music</div>
      </div>

      {/* Chat */}
      <div className="chat">

        {/* Messages */}
        <div className="messages">

          {messages.map((msg, index) => (
            <div className="message" key={index}>
              <strong>{msg.user}:</strong> {msg.text}
            </div>
          ))}

        </div>

        {/* Input */}
        <div className="input-area">

          <input
            type="text"
            placeholder="Type a message..."
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

export default App;