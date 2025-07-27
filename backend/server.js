const express = require("express");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const cors = require('cors')

const {app, server}= require('./socket/socket')


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));


app.use(express.json());
require("dotenv").config();

//Cookie Parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGOURL)
  .then(() => {
    server.listen(process.env.PORT || 4000, () => {
      console.log(
        "Connected to MongoDB successfully and running at port",
        process.env.PORT || 4000
      );
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

//Routes for endpoints
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/message", messageRoutes);
