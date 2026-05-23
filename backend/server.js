const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());


const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

let messages = [];


io.on("connection", (socket) => {
  console.log("User connected:", socket.id);


  socket.emit("loadMessages", messages);


  socket.on("sendMessage", (data) => {
    messages.push(data);

  
    io.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});