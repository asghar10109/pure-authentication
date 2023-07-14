const jwt = require('jsonwebtoken');

const userTokenAuthentication = (req,res,next) => {

    const token = req.headers['authorization'].split(" ")[1];
    if(!token){
        return  res.send({ message:"token is expired you are still un-Authorized" })
    }
        try{
            const decoded =  jwt.verify(token , process.env.Secret_JWT)
            
            req.id = decoded._id
            
            next();
            
        }catch(err){
            res.status(400).send("Invalid token.");
        }
        return next

}

module.exports = userTokenAuthentication;