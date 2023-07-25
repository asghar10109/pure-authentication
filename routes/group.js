const GroupRouter = require('express').Router()
const upload = require('../middleware/multer');
const Auth = require('../middleware/Auth');
const {
    createGroup,
    joinGroup,
    acceptJoinRequest

} = require('../controller/group')

GroupRouter.post('/creategroup',upload.single('coverimage') , createGroup)
GroupRouter.post('/joingroup', joinGroup)
GroupRouter.post('/joinrequest', acceptJoinRequest)


module.exports = GroupRouter