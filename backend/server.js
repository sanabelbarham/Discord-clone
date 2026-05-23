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

// ✅ AUTH ROUTES
app.use("/api/auth", authRoutes);

const server = http.createServer(app);

// SOCKET
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// SOCKET LOGIC
io.on("connection", async (socket) => {
  console.log("User connected:", socket.id);

  const messages = await Message.find();
  socket.emit("loadMessages", messages);

  socket.on("sendMessage", async (data) => {
    const newMessage = new Message(data);
    await newMessage.save();

    io.emit("receiveMessage", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});