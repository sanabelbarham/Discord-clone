import { useEffect, useState } from "react";
import "./App.css";

function App() {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/messages")
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.log(err));
  }, []);
const sendMessage = async () => {

  if (input.trim() === "") return;

  const newMessage = {
    user: "You",
    text: input
  };

  try {

    const res = await fetch("http://localhost:5000/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newMessage)
    });

    const data = await res.json();

    setMessages([...messages, data]);

    setInput("");

  } catch (err) {
    console.log(err);
  }
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
       <button onClick={sendMessage}>Send</button>
        </div>

      </div>

    </div>
  );
}

export default App;