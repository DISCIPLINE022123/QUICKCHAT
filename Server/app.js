import express from "express";
import mongoose from "mongoose";
import authRoutes from "./Router/auth.router.js";
import productRoutes from "./Router/product.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

mongoose.connect("mongodb://127.0.0.1:27017/User", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error:", err));

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api", authRoutes);
app.use("/api/products", productRoutes);

// HTTP server
const server = createServer(app);

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// ✅ Authentication middleware for Socket.IO
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) return next(new Error("Authentication error: no token"));

  try {
    const user = jwt.verify(token, "abhishek"); // your secret
    socket.user = user; // attach user info
    next();
  } catch (err) {
    next(new Error("Authentication error: invalid token"));
  }
});


 //online user track karne ke liye
 const onlineUsers={}; //{roomName:[user1, user2]}

// ✅ Socket events
io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.user.email);

  // Join a room
  socket.on("roomNumber", (roomName) => {
    socket.join(roomName);

      if (!onlineUsers[roomName]) {
      onlineUsers[roomName] = [];
    }

    //yadi includenhi haito include karo
    if(!onlineUsers[roomName].includes(socket.user.email)){
      onlineUsers[roomName].push(socket.user.email);
    }

    io.to(roomName).emit("onlineUsers",  onlineUsers[roomName]);
    io.to(roomName).emit("message", `🔔 ${socket.user.email} joined ${roomName}`);

  });










  // Send message
  socket.on("sendRoomMessage", ({ room, msg, sender }) => {
    io.to(room).emit("message", `${sender}: ${msg}`);
  });

  // Leave room  //remove user 
  socket.on("leaveRoom", (room) => {
    socket.leave(room);
    if(onlineUsers[room]){
 onlineUsers[room] = onlineUsers[room].filter(
  (u)=>u !== socket.user.email
 );
     io.to(room).emit("onlineUsers", onlineUsers[room]);

    }
         io.to(room).emit("message",       `🔔 ${socket.user.email} left ${room}`
);

  });

  socket.on("typing", (data)=>{
    socket.to(data.room).emit("typing", data);
  })

  // Disconnect
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.user.email);
  });
});
console.log(onlineUsers);
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on poo0rt ${PORT}`);
});
