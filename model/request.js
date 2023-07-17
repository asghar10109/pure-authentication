const mongoose = require('mongoose')

const requestModel = new mongoose.Schema({
    
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'

    },
    group:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Group'
    },
    admin:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    isaccepted:{
        type:Boolean,
        default:false
    }
},
{timestamps:true}
) 

module.exports = mongoose.model('request',requestModel)
