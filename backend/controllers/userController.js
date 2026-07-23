const User = require('../models/userSchema')
const jwt = require('jsonwebtoken')
const bcrypt =require('bcrypt');

//GET_USER ENDPOINT
exports.get_user = async (req, res) => {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ message: "Invalid Token" });
            } else {
                const user = await User.findById(decodedToken.id);
                
                // 🛑 CRITICAL SAFETY GUARD: Check if the user actually exists in the database
                if (!user) {
                    return res.status(404).json({ message: "User no longer exists in this database" });
                }

                // Now this block is 100% safe from throwing a TypeError
                const data = { 
                    id: user._id, 
                    name: user.name, 
                    email: user.email, 
                    profile: user.profile, 
                    createdAt: user.createdAt 
                };
                
                return res.status(200).json({ message: data });
            }
        });
    } else {
        return res.status(401).json({ message: "No Token Found" });
    }
};


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
