const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const Message = require("../models/messagesSchema");

exports.getMessages = async (req, res) => {
  try {
    const { userId, selectedUserId } = req.body;
    // console.log(userId, selectedUserId);
    const messages = await Message.find({
      $or: [
        { from: userId, to: selectedUserId },
        { from: selectedUserId, to: userId },
      ],
    });


    // console.log(messages)
    res.status(200).json({ message: messages });
  } catch (err) {
    console.log("Error in loading messages", err);
  }
};

exports.unreadChat= async(req, res)=>{
    const userId = req.body.userId;
    // console.log(req.body)
    try{
        const unreadMessage = await Message.find({ to:userId, seen:false });
        const unreadChat = [...new Set(unreadMessage.map(m => m.from))];
        res.status(200).json({message: unreadChat})
    }
    catch(err){
        res.status(401).json({message:"Error obtaining Messages"})
    }
}
