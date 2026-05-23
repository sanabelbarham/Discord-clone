const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

dotenv.config();

const Message = require("./models/Message");

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


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err));


io.on("connection", async (socket) => {
  console.log("User connected:", socket.id);


  const messages = await Message.find();
  socket.emit("loadMessages", messages);


  socket.on("sendMessage", async (data) => {
    try {
      const newMessage = new Message(data);
      await newMessage.save();

      io.emit("receiveMessage", newMessage);
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});