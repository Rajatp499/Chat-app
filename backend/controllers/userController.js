const User = require('../models/userSchema')
const jwt = require('jsonwebtoken')
const bcrypt =require('bcrypt');

//GET_USER ENDPOINT
exports.get_user =async(req, res)=>{
    const token = req.cookies.token;
      // const token = req.body.token;
      if(token){
        jwt.verify(token, process.env.SECRET,async(err,decodedToken)=>{
          if(err){
            res.status(401).json({message:"Invalid Token"})
          }
          else{
            const user =await User.findById(decodedToken.id)
            // console.log(user)
            const data = {id:user._id, name:user.name, email:user.email, profile: user.profile, createdAt: user.createdAt}
            // console.log(data);
            res.status(200).json({message:data})
          }
        })
      }
      else{
        res.status(401).json({message:"No Token Found"})
      }
}

//UPLOAD_PROFILE ENDPOINT
exports.upload_profile = (req, res)=>{
    const token = req.cookies.token;
    // console.log(req.file.path)
    if(token){
        jwt.verify(token, process.env.SECRET, async(err, decodedToken)=>{
            if(err){
                res.status(401).json({message:"Invalid Token"})
            }
            const user =await User.findById(decodedToken.id)
            user.profile = req.file.path;
            await user.save();

            // const newUser = new User({profile:req.file.path})
            res.status(200).json({message:"Image Uploaded"})
        })
    }
    // res.json(req.file)
}

exports.fetchUsers =async(req, res)=>{
  const token = req.cookies.token;
  if(token){
    const loggedInUser = jwt.verify(token, process.env.SECRET).id;
    const allUsers = await User.find({_id:{$ne: loggedInUser} }).select(' name gender email profile status')
    // console.log(allUsers)
    res.status(200).json({message: allUsers})
  }
  else{
    res.status(401).json({message:"No token found"})
  }
}
