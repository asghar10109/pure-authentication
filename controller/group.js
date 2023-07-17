const groupModel = require('../model/group')
const CryptoJS = require("crypto-js");
const Login_Token_Authentication = require('../middleware/loginjwt')

const createGroup = async (req, res, next) => {
    try {

        const coverImage = req?.files?.coverimage?.map((data) => data?.path?.replace(/\\/g, "/"));

        const newGroup = new groupModel({
            name: req.body.name,
            description: req.body.description,
            coverimage: coverImage,
            group_types: req.body.group_types,
            admin: req.body.admin
        })
        const AddedGroup = await newGroup.save();
        return res.status(200).send({
            message: "Group Created Successfully",
            status: 1,
            data: AddedGroup
        })


    }
    catch (err) {
        console.log(err.message)
        return res.status(500).send({
            message: err.message,
            status: 0
        })
    }
}

const joinGroup = async (req, res, next) => {
    try {
        const group_id = req.body._id;
        const members = req.body.members;
        const groupData = await groupModel.findById(group_id);

        if (!groupData) {
            return res.status(404).json({
                message: 'Group not found',
                status: 0
            });
        }

        if (groupData.group_types === 'public') {
            groupData.members = members;
            await groupData.save();
        } 
        else if (groupData.group_types === 'private') {
            if (groupData.admin) {
                return res.status(401).json({
                    message: 'your requested is already send to the admin',
                    status: 0
                });
            }

        }

        return res.status(200).json({
            message: 'Joined group successfully',
            status: 1,
            data: groupData
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message: 'An error occurred while joining the group',
            status: 0
        });
    }

}

module.exports = {
    createGroup,
    joinGroup
}