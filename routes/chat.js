const chatRouter = require('express').Router()
const upload = require('../middleware/multer')
const Auth = require('../middleware/Auth');

const {
    chatlist,
    imageupload_videoupload
} = require('../controller/chat')

chatRouter.get('/chatlist', chatlist)
chatRouter.post('/attachments',  upload.fields([{name: 'chat_images'}, {name: 'chat_videos'}] ),imageupload_videoupload)




module.exports = chatRouter