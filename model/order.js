const mongoose = require('mongoose')

const orderModel = new mongoose.Schema({
    cart:
        [
          {  product:{
                type: mongoose.Schema.Types.ObjectId,
                ref:'Product'
        
            }}
        ],
    
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'

    }
},
{timestamps:true}
) 

module.exports = mongoose.model('Order',orderModel)
