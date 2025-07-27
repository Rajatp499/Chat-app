const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const Message = require("../models/messagesSchema");
const jwt = require('jsonwebtoken')
const User = require("../models/userSchema");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  path: "/chat",
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

//SOCKET
io.on("connection", async (socket) => {
  console.log("A user connected: ", socket.id);
  const raw = socket.handshake.headers.cookie;
      if (raw) {
        const token = socket.handshake.headers.cookie.replace("token=", "")
    jwt.verify(token, process.env.SECRET, async(err, decodedToken) => {
      if (err) {
        console.log(err.message);
      } else {
        await User.updateOne({_id:decodedToken.id},{
          status:'online',
        })
        await Message.updateMany({to: decodedToken.id},{
          delivered:true
        })
      }
    });
  }



  // Join a chat room
  socket.on("join_room", async(roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
    const [id1, id2] = roomId.split('_')
      const raw = socket.handshake.headers.cookie;
      let userId;
      if (raw) {
        const token = socket.handshake.headers.cookie.replace("token=", "")
    jwt.verify(token, process.env.SECRET, async(err, decodedToken) => {
      if (err) {
        console.log(err.message);
      } else {
        userId = decodedToken.id
        id1 == decodedToken.id ? selectedUserId = id2 :selectedUserId = id1
      }
    });
  }
    await Message.updateMany({from:selectedUserId , to: userId},{seen:true})

  });

  // Handle sending messages
  socket.on("send_message",async({ roomId, message }) => {
    // console.log('received message:', message.time)
    try {
      const messages = new Message(message);
      io.emit("receive_message", message);
      const receiverUser = await User.findById(message.to)
      if(receiverUser.status == 'online'){
        messages.delivered = true;
      }
      messages.save();
    } 
    catch (err) {
      console.log("Error saving messgaes in database", err);
    }

  });

  socket.on("disconnect", async() => {
    console.log("A user disconnected:", socket.id);

   const raw = socket.handshake.headers.cookie;
      if (raw) {
        const token = socket.handshake.headers.cookie.replace("token=", "")
    jwt.verify(token, process.env.SECRET, async(err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.status(401).json({ message: "Invalid Token" });
      } else {
        await User.updateOne({_id:decodedToken.id},{
          status:'offline'
        })
      }
    });
  }

  });

  socket.on("leave_room", (roomId) => {
    socket.leave(roomId);
    console.log(`Socket ${socket.id} left ${roomId}`);
  });
});

module.exports = { app, server };
