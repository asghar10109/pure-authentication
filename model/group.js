const mongoose = require('mongoose')

const groupModel = new mongoose.Schema({
    name:{
        type:String    
    },
    description:{
        type:String
    },
    coverimage:{
        type:String
    },
    group_types:{
        type:Boolean,
        default : true
    },
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    } 
    
    
},
{timestamps:true}
) 

module.exports = mongoose.model('Group',groupModel)