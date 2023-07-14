const jwt = require('jsonwebtoken');

const Login_Token_Authentication =  (data,time) => {

    const token =  jwt.sign(data.toJSON() , process.env.Secret_JWT , { expiresIn: `${time}` } )
    return token;

}

module.exports = Login_Token_Authentication;