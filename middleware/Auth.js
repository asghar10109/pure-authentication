const jwt = require('jsonwebtoken');
const userModel = require('../model/user')

const userTokenAuthentication = async (req,res,next) => {

    const token = req.headers['authorization'].split(" ")[1];
    const user = await userModel.findOne({user_authentication:token})

    if(!token){
        return  res.send
        ({ message:"token is expired you are still un-Authorized" ,status:400})
    }
    else if(user?.user_authentication !== token) {
        return  res.send({ message:"token is not matched",status:400})
    }
    else if(user?.is_blocked === true){
        return  res.send({ message:"user is blocked ",status:400})
    }
    else if(user?.is_profile_deleted === true){
            return  res.send({ message:"user profile is deleted ",status:400})
    }
    else{

        try{
            const decoded =  jwt.verify(token , process.env.Secret_JWT)
            
            req.id = decoded._id
            
            next();
            
        }catch(err){
            res.status(400).send("Invalid token.");
        }
        return next
    }


}

module.exports = userTokenAuthentication;