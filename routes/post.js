const postRouter = require('express').Router()
const upload = require('../middleware/multer');
const Auth = require('../middleware/Auth');
const {
    createpost,
    getPost,
    likedonPost,
    commentsonPost

} = require('../controller/post')

postRouter.post('/createpost', upload.fields([{name: 'post_image'}, {name: 'videos'}]),createpost)
postRouter.get('/getPost' , getPost)
postRouter.put('/likedonpost', likedonPost)
postRouter.put('/commentsonpost', commentsonPost)

module.exports = postRouter

