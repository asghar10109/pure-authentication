const mongoose = require('mongoose')

const userModel = new mongoose.Schema({
    username:{
        type:String,
        required: true,
        
    },
    
    email:{
        type:String,
        required: true,
        unique : true
    },
    password:{
        type:String,
        required: true,
         
    },
    phone:{
        type:String,
        required: true,
        unique : true,
        
        
    },
    avators:[{
        type:String,
        required: true
    }],
    otp:{
        type:String,
        
    },
    is_verified:{
        type:Boolean,
        default:false
    },
    user_is_profile_complete:{
        type:Boolean,
        default:false
    },
    user_is_forgot:{
        type:Boolean,
        default:false
    },
    is_blocked:{
        type:Boolean,
        default:false
    },
    user_authentication:{
        type:String,
        
    },
    user_social_token:{
        type:String,
        
    },
    user_social_type:{
        type:String,
         
    },
    user_device_token:{
        type:String,
        
    },
    user_device_type:{
        type:String,
       
    },
    is_profile_deleted:{
        type:Boolean,
        default:false
    },
    is_notification:{
        type:Boolean,
        default:false
    }
    
},
{timestamps:true}
) 

module.exports = mongoose.model('User',userModel)