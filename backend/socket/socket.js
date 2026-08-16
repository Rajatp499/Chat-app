const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const Message = require("../models/messagesSchema");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const axiosInstance = require("../services/axiosInstance");

const AI_USER_ID = "64f000000000000000000001";
const DEFAULT_AI_MODEL = "gpt-oss:120b-cloud";
const ALLOWED_AI_MODELS = new Set([DEFAULT_AI_MODEL, "qwen:1.8b"]);

const resolveAiModel = (requestedModel) =>
  ALLOWED_AI_MODELS.has(requestedModel) ? requestedModel : DEFAULT_AI_MODEL;

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
    const token = socket.handshake.headers.cookie.replace("token=", "");
    jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
      } else {
        await User.updateOne(
          { _id: decodedToken.id },
          {
            status: "online",
          },
        );
        await Message.updateMany(
          { to: decodedToken.id },
          {
            delivered: true,
          },
        );
      }
    });
  }

  // Join a chat room
  socket.on("join_room", async (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
    const [id1, id2] = roomId.split("_");
    const raw = socket.handshake.headers.cookie;
    let userId;
    if (raw) {
      const token = socket.handshake.headers.cookie.replace("token=", "");
      jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
        if (err) {
          console.log(err.message);
        } else {
          userId = decodedToken.id;
          id1 === decodedToken.id
            ? (selectedUserId = id2)
            : (selectedUserId = id1);
        }
      });
    }
    await Message.updateMany(
      { from: selectedUserId, to: userId },
      { seen: true },
    );
  });

  // Handle sending text messages
  socket.on("send_message", async ({ roomId, message }) => {
    try {
      const messages = new Message(message);
      // console.log(roomId, message);
      io.emit("receive_message", message);
      const receiverUser = await User.findById(message.to);
      if (receiverUser.status == "online") {
        messages.delivered = true;
      }
      messages.save();

      //FOR AI chat
      if (message.to === AI_USER_ID) {
        const aiModel = resolveAiModel(message.model);

        // A single id ties together the start/chunk/end events for this
        // particular AI reply so the frontend can grow the right bubble.
        const streamId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

        io.to(roomId).emit("ai_stream_start", {
          roomId,
          streamId,
          from: AI_USER_ID,
          to: message.from,
        });

        try {
          // NOTE: responseType "stream" tells axios to give us a Node.js
          // readable stream (response.data) instead of buffering the
          // whole body, which is what lets us read Ollama's NDJSON
          // chunks as they arrive.
          const response = await axiosInstance.post(
            "/api/generate",
            {
              model: aiModel,
              prompt: message.text,
              stream: true,
            },
            { responseType: "stream" },
          );

          let buffer = "";
          let fullResponseText = "";

          response.data.on("data", (chunk) => {
            buffer += chunk.toString();

            // Ollama sends one JSON object per line (NDJSON). A single
            // TCP chunk can contain multiple lines, or a partial line,
            // so we split on "\n" and keep the last (possibly
            // incomplete) piece buffered for the next chunk.
            const lines = buffer.split("\n");
            buffer = lines.pop();

            for (const line of lines) {
              if (!line.trim()) continue;

              try {
                const parsed = JSON.parse(line);

                if (parsed.response) {
                  fullResponseText += parsed.response;
                  io.to(roomId).emit("ai_stream_chunk", {
                    roomId,
                    streamId,
                    text: parsed.response,
                  });
                }

                if (parsed.done) {
                  io.to(roomId).emit("ai_stream_end", {
                    roomId,
                    streamId,
                    fullText: fullResponseText,
                    stats: {
                      done_reason: parsed.done_reason,
                      total_duration: parsed.total_duration,
                      eval_count: parsed.eval_count,
                    },
                  });

                  const aiMessage = new Message({
                    from: AI_USER_ID,
                    to: message.from,
                    text: fullResponseText,
                    time: Date.now(),
                    delivered: true,
                    seen: false,
                  });
                  aiMessage
                    .save()
                    .catch((saveErr) =>
                      console.log("Error saving AI message", saveErr),
                    );
                }
              } catch (parseErr) {
                console.log(
                  "Failed to parse AI stream line:",
                  line,
                  parseErr.message,
                );
              }
            }
          });

          response.data.on("end", () => {
            console.log("AI stream ended.");
          });

          response.data.on("error", (streamErr) => {
            console.log("AI stream error:", streamErr.message);
            io.to(roomId).emit("ai_stream_error", {
              roomId,
              streamId,
              message: streamErr.message,
            });
          });
        } catch (err) {
          console.log("Error calling AI generate endpoint:", err.message);
          io.to(roomId).emit("ai_stream_error", {
            roomId,
            streamId,
            message: err.message,
          });
        }
      }
    } catch (err) {
      console.log("Error saving messgaes in database", err);
    }
  });

  //handle sending file messages
  socket.on("send_file", async ({ roomId, message }) => {
    try {
      const messages = new Message(message);
      // console.log(messages, message)
      io.emit("receive_message", messages);
      const receiverUser = await User.findById(messages.to);
      if (receiverUser.status == "online") {
        messages.delivered = true;
      }
      messages.save();
    } catch (err) {
      console.log("Error saving messgaes in database", err);
    }
  });

  socket.on("disconnect", async () => {
    console.log("A user disconnected:", socket.id);

    const raw = socket.handshake.headers.cookie;
    if (raw) {
      const token = socket.handshake.headers.cookie.replace("token=", "");
      jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          // res.status(401).json({ message: "Invalid Token" });
        } else {
          await User.updateOne(
            { _id: decodedToken.id },
            {
              status: "offline",
            },
          );
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