const jwt = require('jsonwebtoken')


const requireAuth = (req, res, next) =>{
    const token = req.cookies.token
    if(token){
        jwt.verify(token, process.env.SECRET, (err, decodedToken)=>{
            if(err){
                console.log(err.message)
                res.status(401).json({message:"Invalid Token"})
            }
            else{
                res.status(200).json({message:decodedToken})
                next();
            }
        })
    }
    else{
        res.status(401).json({message:"No Token Found"})
    }
}

module.exports = requireAuth;