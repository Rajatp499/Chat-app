const nodemailer = require("nodemailer");

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "pradhanrajat499@gmail.com",
    pass: "wvsh glyn acmk bule",
  },
});



const sendMail =async (code, email)=>{
try{
    const info = await transporter.sendMail({
    from: '"Test" <pradhanrajat499@gmail.com>',
    to: email,
    subject: "OTP",
    text: "Code", // plain‑text body
    html: `${code}`, // HTML body
  });
}
catch(err){
    console.log("Error in Sending mail, ", err);
}

}

module.exports = sendMail;