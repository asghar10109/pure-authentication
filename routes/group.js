const GroupRouter = require('express').Router()
const multer = require('../middleware/multer');
const Auth = require('../middleware/Auth');
const {
    createGroup,
    joinGroup

} = require('../controller/group')

GroupRouter.post('/creategroup', multer.upload , createGroup)
GroupRouter.post('/joingroup', joinGroup)



module.exports = GroupRouter