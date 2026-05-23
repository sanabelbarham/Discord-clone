const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

dotenv.config();

const Message = require("./models/Message");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// DATABASE
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// SOCKETS
io.on("connection", async (socket) => {

  console.log("User connected:", socket.id);

  // DEFAULT CHANNEL
  socket.join("general");

  // LOAD GENERAL MESSAGES
  const generalMessages = await Message.find({
    channel: "general"
  });

  socket.emit("loadMessages", generalMessages);

  // JOIN CHANNEL
  socket.on("joinChannel", async (channel) => {

    // leave old rooms
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.leave(room);
      }
    });

    // join new room
    socket.join(channel);

    // load channel messages
    const messages = await Message.find({ channel });

    socket.emit("loadMessages", messages);
  });

  // SEND MESSAGE
  socket.on("sendMessage", async (data) => {

    const newMessage = new Message({
      user: data.user,
      text: data.text,
      channel: data.channel
    });

    await newMessage.save();

    // SEND ONLY TO CHANNEL
    io.to(data.channel).emit("receiveMessage", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});