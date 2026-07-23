const User = require("../models/userSchema");
const maxAge = 60 * 60 * 24 * 3;
const sendMail = require("../middleware/emailVerification");

//JWT
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//Delete unverified users every time anyone logges in
const deleteUnverifiedUsers =async()=>{
  try{

    await User.deleteMany({otpExpires:{$exists: true}});
  }
  catch(err){
    console.log(err)
  }

}

//CHECK AUTH
exports.checkAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.status(401).json({ message: "Invalid Token" });
      } else {
        res.status(200).json({ message: decodedToken });
        next();
      }
    });
  } else {
    res.status(401).json({ message: "No Token Found" });
  }
};


//REGISTER ENDPOINT
exports.register = async (req, res) => {
  const { name, email, password, otp, gender } = req.body;
  // console.log("Received data:", { name, email, password });

  const newUser = await User.findOne({ email });
  const actualOtp = newUser.otp;
  // console.log("actualOTP: ",actualOtp)
  if (Date.now() > newUser.otpExpires) {
    await newUser.deleteOne();
    res.status(401).json({ message: "OTP has expired. Please enter the email again" });
    return;
  }
  if (otp == actualOtp) {
    try {
      const user = await User.findOne({email });

      if (user) {
        user.name = name;
        user.password = password;
        user.otp = undefined;
        user.otpExpires = undefined;
        user.gender = gender;
      } else {
        user = new User({ name, email, password, gender });
      }

      await user.save();

      const token = jwt.sign({ id: user._id }, process.env.SECRET, {
        expiresIn: maxAge,
      });
      res.cookie("token", token, { httpOnly: true, maxAge: maxAge * 1000 });

      console.log("User Saved in database:", user);
      res
        .status(200)
        .json({
          message: "Data received and saved successfully",
          SavedData: user,
        });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  } else {
    res.status(500).json({ message: "Invalid OTP" });
  }
};

//LOGIN ENDPOINT
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        const token = jwt.sign({ id: user._id }, process.env.SECRET, {
          expiresIn: maxAge,
        });
        res.cookie("token", token, { httpOnly: true, maxAge: maxAge * 1000, secure:false});
        console.log("cookie saved");
        res.status(200).json({ message: "Login Sucessful" });
        deleteUnverifiedUsers();

        return;
      }
      throw Error("invalid password");
    }
    throw Error("Email not found");
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

//LOGOUT ENDPOINT
exports.logout = (req, res) => {
  res.cookie("token", " ", { maxAge: 1 });
  res.json({ message: "Logout Sucessfull" });
};

//SEND_OTP ENDPOINT
exports.send_otp = async (req, res) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const email = req.body.email;
    const user = await User.findOne({email})
    if(user){
      res.status(500).json({message:"Email already regestered"})
      return;
    }

    sendMail(otp, email);
    await User.updateOne(
      { email },
      {
        otp,
        otpExpires: Date.now() + 2 * 60 * 1000,
      },
      { upsert: true }
    );

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log("Error sending email:", error);
    res.status(500).json({ message: "Error sending email" });
  }
};
