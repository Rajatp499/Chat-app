const axios = require("axios");

const axiosInstance = axios.create({
  baseURL: process.env.AI_API_URL,
  //   withCredentials: true,
  headers: {
    "Authorization": `Bearer ${process.env.AI_API_KEY}`,
    "Content-Type": "application/json",
  },
});

module.exports = axiosInstance;
