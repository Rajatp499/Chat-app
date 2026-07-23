const nodemailer = require("nodemailer");


const sendMail =async (code, email)=>{


//Create fake mail
// let testAccount = await nodemailer.createTestAccount();
// console.log('test account', testAccount);

// Create a test account or replace with real credentials.
const transporter =nodemailer.createTransport({
  // host: "smtp.gmail.com",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user:'pradhanrajat499@gmail.com',
    pass: process.env.APP_PASSWORD
  },
});



try{
    const info = await transporter.sendMail({
    from: `"Test" pradhanrajat499@gmail.com`,
    to: email,
    subject: "OTP",
    text: "Code", // plain‑text body
    html: `${code}`, // HTML body
  });
  console.log('mail send to ', email)
}
catch(err){
    console.log("Error in Sending mail, ", err);
}

}

module.exports = sendMail;