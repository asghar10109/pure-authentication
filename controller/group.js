const groupModel = require('../model/group')
const requestModel = require('../model/request');

const CryptoJS = require("crypto-js");
const Login_Token_Authentication = require('../middleware/loginjwt')

const createGroup = async (req, res, next) => {
    try {

        const coverImage = req?.file?.path?.replace(/\\/g, "/");

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
            const adminRequest = await requestModel.findOne({
              group: group_id,
              user: members,
              admin: groupData.admin
            });
      
            if (adminRequest) {
              return res.status(401).json({
                message: 'Your request is already sent to the admin',
                status: 0
              });
            }
      
            const request = new requestModel({
              user: members,
              group: group_id,
              admin: groupData.admin
            });
      
            const reqdata = await request.save();
      
            return res.status(200).json({
              message: 'Join request sent to admin',
              status: 1,
              data: reqdata
            });
          }

        return res.status(200).json({
            message: 'Joined group successfully',
            status: 1,
            data: groupData
        });

    } 
    catch (error) {
        
        return res.status(500).json({
            message: error.message,
            status: 0
        });
    }

}

const acceptJoinRequest = async (req, res, next) => {
    try {
      const request_id = req.body._id;
      const isaccepted = req.body.isaccepted
    
      const request = await requestModel.findById(request_id);
  
      if (!request) {
        return res.status(404).json({
          message: 'Join request not found',
          status: 0
        });
      }
  
      request.isaccepted = isaccepted;
      await request.save();
      
      if(request.isaccepted === true){

          const group = await groupModel.findById(request.group);
          group.members.push(request.user);
          await group.save();
      
          return res.status(200).json({
            message: 'Join request accepted',
            status: 1,
            data: group
          });
      }
    } 
    catch (error) {
      console.log(error.message);
      return res.status(500).json({
        message: 'An error occurred while accepting join request',
        status: 0
      });
    }
  };
  

module.exports = {
    createGroup,
    joinGroup,
    acceptJoinRequest
}