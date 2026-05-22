const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend is working " });
});

app.get("/api", (req, res) => {
  res.json({ message: "API is working " });
});

let messages = [
  { user: "Ali", text: "Hello " },
  { user: "Sara", text: "Hi!" }
];

app.get("/messages", (req, res) => {
  res.json(messages);
});

app.post("/messages", (req, res) => {

  const newMessage = {
    user: req.body.user,
    text: req.body.text
  };

  messages.push(newMessage);

  res.json(newMessage);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});