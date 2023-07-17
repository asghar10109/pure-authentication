const UserRouter = require('express').Router()
const multer = require('../middleware/multer');
const Auth = require('../middleware/Auth');
const {
    createUser,
    LoginUser,
    Profile,
    EditProfile,
    OtpCheck,
    deleteUsers,
    forgetPassword,
    resetPassword,
    logout,
    notificationToggle,
    softDelete
} = require('../controller/user')

UserRouter.post('/createUsers', multer.upload , createUser)

UserRouter.post('/login',   LoginUser)

UserRouter.post('/profile', Auth , Profile)

UserRouter.put('/EditProfile', Auth , multer.upload, EditProfile)

UserRouter.post('/otpverification',Auth, OtpCheck);

UserRouter.delete('/deleteaccount',Auth, deleteUsers);

UserRouter.post('/forgetpassword', forgetPassword);

UserRouter.post('/resetpassword', resetPassword);

UserRouter.post('/logout',Auth, logout);

UserRouter.put('/deleteuserprofile', softDelete);

UserRouter.put('/notificationtoggle',Auth, notificationToggle);


module.exports = UserRouter