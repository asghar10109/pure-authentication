const mongoose = require('mongoose')

const productModel = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    status:{
        type:Boolean,
        default:true
    },
    color:{
        type:String,
        required: true
    },
    size:{
        type:String,
        required: true
    },
    weight:{
        type:String,
        required: true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    }
},
{timestamps:true}
) 

module.exports = mongoose.model('Product',productModel)