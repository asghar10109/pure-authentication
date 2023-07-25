const userModel = require('../model/user')
const CryptoJS = require("crypto-js");
const Login_Token_Authentication = require('../middleware/loginjwt')
const jwt = require("jsonwebtoken");
const moment = require('moment')


const createUser = async (req, res, next) => {
    try {
        const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const pass = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
        const userAvator = req?.file?.path?.replace(/\\/g, "/")
        if (!req.body.email) {
            return res.send({
                message: "please enter your email",
                status: 400
            });
        }
        else if (!req.body.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            return res.send({
                message: "invalid email please try it again",
                status: 400
            });
        }
        else if (!req.body.password) {
            return res.send({
                message: "please enter your password",
                status: 400
            });
        }
        else if (!req.body.password || !req.body.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)) {
            return res.send({
                message: "Password should include at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character.😞",
                status: 400
            });
        }
        else if (!req.body.phone) {
            return res.send({
                message: "please enter your phone",
                status: 400
            });
        }
        else if (!req.body.phone || !req.body.phone.match(/^[0-9]{11}$/)) {
            return res.send({
                message: "Phone number must be valid and have 11 digits",
                status: 400
            });
        }
       
        else if (!req.body.dob) {
            return res.send({
                message: "please enter your dob",
                status: 400
            });
        }
        else {
            const existingUser = await userModel.findOne({ email: req.body.email });

            if (existingUser) {
                return res.send({
                    message: "Email already exists",
                    status: 400
                });
            }
            else {
                const random = Math.floor(Math.random() * 100000);
                const db = moment(req.body.dob, "YYYY-MM-DD").format("ddd MMM DD YYYY");
                const newUser = new userModel({
                    username: req.body.username,
                    email: req.body.email,
                    password: CryptoJS.AES.encrypt(req.body.password, process.env.Secret_password).toString(),
                    dob: db,
                    phone: req.body.phone,
                    avators: userAvator,
                    otp: `${random}`

                });

                console.log(newUser)
                const datas = await newUser.save();
                res.send({
                    message: "Customer created successfully",
                    status: 201,
                    data: datas
                })
            }
        }


    }
    catch (err) {
        console.log(err.message)
        return res.status(500).send({
            message: err.message,
            status: 0
        })
    }
}


const LoginUser = async (req, res, next) => {

    const type_email = req.body.email
    const type_password = req.body.password

    try {
        if (!req.body.email) {
            return res.send({
                message: "please enter your email",
                status: 400
            });
        }
        else if (!req.body.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            return res.send({
                message: "invalid email please try it again",
                status: 400
            });
        }
        else if (!req.body.password) {
            return res.send({
                message: "please enter your password",
                status: 400
            });
        }
        else if (!req.body.password || !req.body.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)) {
            return res.send({
                message: "Password should include at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character.😞",
                status: 400
            });
        }
        else {
            const data = await userModel.findOne({ email: type_email });


            const show_password = CryptoJS.AES.decrypt(data.password, process.env.Secret_password);
            const original_password = show_password.toString(CryptoJS.enc.Utf8);

            if (!data) {
                res.send({
                    message: "data not found",
                    status: 404
                });
            }
            else if (type_email !== data.email) {
                res.send({
                    message: "email not found",
                    status: 404
                });
            }



            else if (type_email == data.email && type_password == original_password) {
                if (data.is_verified === true) {

                    const token = jwt.sign(
                        {
                            id: data._id,
                        },
                        process.env.Secret_JWT,
                        { expiresIn: "1h" }
                    );
                    console.log(token);


                    const save_token = await userModel.findByIdAndUpdate(
                        { _id: data?._id },
                        { $set: { user_authentication: `${token}` } },
                        { new: true }
                    );

                    res.send({
                        message: "login successfully created",
                        status: 201,
                        data: save_token
                    });
                }
                else {
                    res.send({
                        message: "please verify your email",
                        status: 400
                    });
                }
            }

            else {
                res.send({ message: "login not found", status: 404 });
            }
        }


    }
    catch (err) {

    }



}


const Profile = async (req, res, next) => {
    const Id = req.id
    console.log(Id)
    try {

        const data = await userModel
            .findOne({ _id: Id })
            .select('_id username email phone avator');
        console.log(data);

        res.send({
            message: "Data found",
            status: 200,
            data: data
        })
    } catch (err) {
        return res.status(500).send({
            message: err.message,
            status: 0
        })
    }
}

const EditProfile = async (req, res, next) => {
    const Id = req.id
    const { username, phone } = req.body;
    console.log(username, phone)
    try {

        const userAvator = req?.file?.path?.replace(/\\/g, "/")
        const db = moment(req.body.dob, "YYYY-MM-DD").format("ddd MMM DD YYYY");

        if (!phone === undefined && !phone.match(/^[0-9]{11}$/)) {
            return res.send({
                message: "Phone number must be valid and have 11 digits",
                status: 400
            });
        }
        else {

            const data = await userModel.updateOne({ _id: Id }, { $set: { username: username, phone: phone, avators: userAvator, dob: db, user_is_profile_complete: true } }, { new: true })

            res.send({
                message: "Data updated",
                status: 200,
                data: data
            })
        }
    }
    catch (err) {
        return res.status(500).send({
            message: err.message,
            status: 0
        })
    }

}

const OtpCheck = async (req, res, next) => {
    const { otp, email } = req.body;



    try {
        if (!email) {
            return res.send({
                message: "please enter your email",
                status: 400
            });

        }
        else if (!otp) {
            return res.send({
                message: "please enter your otp",
                status: 400
            });

        }
        else if (otp && email) {

            const data = await userModel.findOne({ email: email })
            if(data.email !== email) {
                return res.send({
                    message: "email not found",
                    status: 404
                });
            }
            else if (data.otp !== otp) {
                return res.send({
                    message: "otp not found",
                    status: 404
                });
            }

            else if (data.otp === otp) {
                data.is_verified = true;
                await data.save();
                res.send({
                    message: "OTP Success",
                    status: 200
                })
            }
            else {
                return res.send({
                    message: "please insert data for verification",
                    status: 404
                });
            }
        }
        else {
            return res.status(401).json({ error: "please give all email and otp for verification your account" });
        }
    }
    catch (err) {
        return res.status(500).send({
            message: err.message,
            status: 0
        })
    }
}

const deleteUsers = async (req, res, next) => {
    const ID = req.id
    try {


        const data = await userModel.deleteOne({ _id: ID })
        data.is_profile_deleted = true
        await data.save();
        res.send({
            message: 'deleted user ✌️',
            status: 201,
            data: data
        })
    }
    catch (err) {
        return res.status(500).send({
            message: err.message,
            status: 0
        })
    }
}

const forgetPassword = async (req, res, next) => {
    try {

        const random = Math.floor(Math.random() * 1000);
        const email = req.body.email
        if (!email) {
            return res.send({
                message: "please enter your email✌️",
                status: 400
            })
        }
        else if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            return res.send({
                message: "invalid email please try it again😞",
                status: 400
            })
        }
        else {

            const user = await userModel.findOne({ email: email })

            if (!user) {
                return res.send({
                    message: "User not found",
                    status: 404
                });
            }

            user.otp = random;
            user.user_is_forgot = true;
            await user.save();

            res.send({
                message: "OTP generated and saved",
                status: 201,
                data: user
            });
        }
    }
    catch (err) {
        return res.status(500).send({
            message: err.message,
            status: 0
        })
    }
}


const resetPassword = async (req, res, next) => {
    try {

        const id = req.body._id
        const changepassword = CryptoJS.AES.encrypt(req.body.password, process.env.Secret_password).toString()
        console.log(changepassword);
        const user = await userModel.findOne({ _id: id })
        console.log(user)
        if (!user) {
            return res.send({
                message: "User not found",
                status: 404
            });
        }
        else {
            user.password = changepassword
            await user.save();
            res.send({
                message: "Password updated succesfully ",
                status: 201,
                data: user
            });

        }

    }
    catch (err) {
        return res.status(500).send({
            message: err.message,
            status: 0
        })
    }

}

const logout = async (req, res, next) => {
    userid = req.id
    console.log(userid)
    const user = await userModel.findById({ _id: userid })
    if (!user) {
        return res.send({
            message: "User not found",
            status: 404
        });
    }
    else {
        user.user_authentication = null;
        await user.save();
        res.send({
            message: "User logged out",
            status: 201,
            data: user
        });
    }
}

const notificationToggle = async (req, res, next) => {
    try {
        userid = req.id
        const user = await userModel.findById({ _id: userid });
        console.log(user)
        if (!user) {
            return res.status(404).send({
                message: 'User not found',
                status: 404
            });
        }

        // Toggle the notification status
        user.is_notification = !user.is_notification;
        await user.save();

        res.send({
            message: 'Notification status updated successfully',
            status: 200,
            data: {
                is_notification: user
            }
        });
    } catch (err) {
        res.status(500).send({
            message: 'Internal server error',
            status: 500
        });
    }
}

const softDelete = async (req, res, next) => {
    try {
        const email = req.body.email;
        const is_blocked = req.body.is_blocked;
        const is_profile_deleted = req.body.is_profile_deleted;
        console.log(email, is_blocked, is_profile_deleted);

        const user = await userModel.findOne({ email: email });
        console.log(user);

        if (user) {
            if (is_blocked !== undefined) {
                user.is_blocked = is_blocked;
                await user.save();
                res.send({
                    message: user.is_blocked === true
                        ? `This user ${user.username} is blocked successfully`
                        : `This user ${user.username} is unblocked successfully`,
                    status: 200,
                    data: user
                });
            }
            else if (is_profile_deleted !== undefined) {
                user.is_profile_deleted = is_profile_deleted;
                await user.save();
                res.send({
                    message: user.is_profile_deleted === true
                        ? `This user ${user.username} is deleted successfully`
                        : `This user ${user.username} is not deleted successfully`,
                    status: 200,
                    data: user
                });
            }
            else {
                res.status(400).send({
                    message: `Missing required fields for update`,
                    status: 400,
                });
            }
        }
        else {
            res.status(404).send({
                message: `User with email ${email} not found`,
                status: 400,
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message,
            status: 500,
        });
    }
}

module.exports = {
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
}