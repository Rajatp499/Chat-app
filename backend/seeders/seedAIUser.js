const User = require("../models/userSchema");
const mongoose = require("mongoose")

//COnstants
  const AI_USER_ID= new mongoose.Types.ObjectId("64f000000000000000000001"); // any valid 24-char hex string
  const AI_EMAIL = "gpt-oss:120b-cloud";


async function seedAiUser() {
  const existing = await User.findOne({ email: AI_EMAIL });

  if (existing) {
    console.log("AI user already exists, skipping seed.");
    return existing;
  }

  const aiUser = await User.create({
    _id: AI_USER_ID,
    name: "AI",
    email: AI_EMAIL,
    password: process.env.AI_USER_PASSWORD || "some-long-random-string",
    gender: "not specified",
    status: "online",
  });

  console.log("AI user created:", aiUser._id);
  return aiUser;
}

module.exports = seedAiUser;