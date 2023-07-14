const mongoose = require('mongoose')
const group = require('./group')

const postModel = new mongoose.Schema({
    name:{
        type:String    
    },
    description:{
        type:String
    },
    avators: [{
      type: String
    }],
    videos: [{
      type: String
    }],
    liked: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
          }
        }
      ],
    comments: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
          },
          text: String
        }
    ],

    issaved:{
        type:Boolean,
        default:false
    },
    isreported:{
        type:Boolean,
        default:false
    },
    group:{
        type:mongoose.Types.ObjectId,
        ref:'Group'
    }
    
},
{timestamps:true}
) 

module.exports = mongoose.model('Post',postModel)