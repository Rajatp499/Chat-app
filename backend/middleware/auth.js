const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  // console.log('sca')
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.status(401).json({ message: "Invalid Token" });
      } else {
        req.user = decodedToken;
        next();
      }
    });
  } else {
    res.status(401).json({ message: "No Token Found" });
  }
};

module.exports = requireAuth;
