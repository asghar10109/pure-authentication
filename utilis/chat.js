const socket = require('socket.io')
const chatModel = require('../model/chat')
const groupModel = require('../model/group')
const mongoose = require('mongoose')
const userModel = require('../model/user') 

const getmessage = async (object, callback) => {

  const gid = object.groupid

  // const chatdata = await chatModel.findById({ _id: groupid })
  // const gid = new mongoose.Types.ObjectId(groupid)

  //   const data = [
  //     {
  //       '$match': {
  //         '_id': gid
  //       }
  //     }, {
  //       '$lookup': {
  //         'from': 'users',
  //         'localField': 'members',
  //         'foreignField': '_id',
  //         'as': 'result'
  //       }
  //     }, {
  //       '$unwind': {
  //         'path': '$result'
  //       }
  //     }
  //   ]
  //   const result = await groupModel.aggregate(data)
  //   callback(result)
  
  const groupchat = await chatModel.find({ groupid: gid })
  callback(groupchat)

  
}

const sendmessage = async (object, callback) =>  {
    const groupid = object.groupid
    const senderid = object.senderid
    const message = object.message

    const data = new chatModel({
      groupid: groupid,
      senderid: senderid,
      message: message
    })
    const chatdata = await data.save()
    callback(chatdata)

}

const getlastmessage = async(object, callback) => {
  const senderid = object.senderid
  const sender_id = new mongoose.Types.ObjectId(senderid)

  const lastMessages = await chatModel.aggregate([
    {
      $match: { senderid:  sender_id},
    },
    {
      $sort: { groupid: 1, createdAt: -1 }, 
    },
    {
      $group: {
        _id: "$groupid",
        lastMessage: { $first: "$message" },
        createdAt: { $first: "$createdAt" }, 
      },
    },
    {
      $project: {
        _id: 0,
        groupid: "$_id",
        lastMessage: 1,
        createdAt: 1,
      },
    },
    {
      $lookup: {
        from: 'groups', 
        localField: 'groupid', 
        foreignField: '_id', 
        as: 'result'
      }
    },
    {
      $unwind: {
        path: '$result'
      }
    }

  ]);
  callback(lastMessages)

}


const singlechat_get = async(object,callback)=>{
      const senderid = object.senderid
      const receiverid = object.receiverid
      const data = await chatModel.find({$or: [
        { $and: [{ senderid: senderid }, { receiverid: receiverid }] },
        { $and: [{ senderid: receiverid }, { receiverid: senderid }] },
      ],})
      callback(data)

}

const singlechat_send = async(object,callback)=>{
  const senderid = object.senderid
  const receiverid = object.receiverid
  const message = object.message
  const chat_images = object.chat_images
  const chat_videos = object.chat_videos 

  const data = new chatModel({
    senderid: senderid,
    receiverid: receiverid,
    message: message,
    chat_images:chat_images,
    chat_videos:chat_videos
  })

  const chatdata = await data.save()
  callback(chatdata)
}


module.exports = {
  getmessage,
  sendmessage,

  getlastmessage,
  
  singlechat_get,
  singlechat_send

}