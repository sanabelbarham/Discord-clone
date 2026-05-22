import { useEffect, useState } from "react";
import "./App.css";

function App() {

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/messages")
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.log(err));
  }, []);

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
          <input type="text" placeholder="Type a message..." />
          <button>Send</button>
        </div>

      </div>

    </div>
  );
}

export default App;