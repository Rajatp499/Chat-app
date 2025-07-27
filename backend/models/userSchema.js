//validator
const {isEmail} = require("validator");

//Bcrypt for hashing
const bcrypt = require("bcrypt");

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name"],
  },
  email: {
    type: String,
    required: [true, "Please enter a email"],
    unique: true,
    validate:[isEmail, "Please enter a valid email"]
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength:[6, "please enter strong password"]
  },
  otp:{
    type:Number,
  },
  otpExpires:{
    type:Date,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  profile:{
    type:String,
    default: 'uploads/default.jpg',
    required: false
  },
  gender:{
    type:String,
    required:true,
    default:'not specified',
    enum:['male', 'female', 'not specified']
  },
  status:{
    type:String,
    enum:['online','offline']
  }
});

userSchema.pre('save',async function(next){
  const salt =await bcrypt.genSalt();
  this.password =await bcrypt.hash(this.password,salt);
  next();
})

module.exports = mongoose.model("User", userSchema);
