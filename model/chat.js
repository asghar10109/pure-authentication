const mongoose = require('mongoose');

const chatModel = new mongoose.Schema({
    senderid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiverid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    groupid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',   
    },

    message:{
        type: String
    },

    chat_images:[{
        type: String
    }],
    
    chat_videos:[{
        type: String
    }]



    
},
{timestamps:true}
)


module.exports = mongoose.model('Chat', chatModel);