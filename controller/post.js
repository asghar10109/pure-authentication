const postModel = require('../model/post')
const groupModel = require('../model/group')
const mongoose = require('mongoose')

const createpost = async (req, res, next) => {

    try {
        const user = req.body.user
        const group = req.body.group

        const data = await groupModel.findById({ _id: group })
        const memberIds = data.members.map(member => member.toString());


        if (memberIds.includes(user)) {
            const post_image = req?.files?.post_image?.map((data) => data?.path?.replace(/\\/g, "/"));
            const videos = req?.files?.videos?.map((data) => data?.path?.replace(/\\/g, "/"));

            const newPost = new postModel({
                name: req.body.name,
                description: req.body.description,
                post_image: post_image,
                videos: videos,
                issaved: req.body.issaved,
                isreported: req.body.isreported,
                group: group
            })
            const AddedPost = await newPost.save();
            
            return res.status(200).send({
                message: "Post Created Successfully",
                status: 1,
                data: AddedPost
                
            })
        }
        else {
            res.send(404, { message: "member doesnt exist", status: 404 })
        }


        // const post_image = req?.files?.post_image?.map((data) => data?.path?.replace(/\\/g, "/"));
        // const videos = req?.files?.videos?.map((data) => data?.path?.replace(/\\/g, "/"));

        // const newPost = new postModel({
        //     name: req.body.name,
        //     description: req.body.description,
        //     post_image: post_image,
        //     videos: videos,
        //     issaved: req.body.issaved,
        //     isreported: req.body.isreported,
        //     group: group
        // })
        // const AddedPost = await newPost.save();
        // return res.status(200).send({
        //     message: "Post Created Successfully",
        //     status: 1,
        //     data: AddedPost
        // })
    }
    catch (err) {

        return res.status(500).send({
            message: err.message,
            status: 0
        })
    }
}


const likedonPost = async (req, res, next) => {


    try {
        const user = req.body.user
        const group = req.body.group
        const post = req.body.post

        const data = await groupModel.findById({ _id: group })
        const memberIds = data.members.map(member => member.toString());
        

        if (memberIds.includes(user)) {
            const postdata = await postModel.findById({_id: post})
            postdata.liked.push(user)
            await postdata.save()
            return res.status(200).send({
                message: "Post Liked Successfully",
                status: 1,
                data: postdata
            })
        }
        else{
            res.send(404, { message: "member doesnt exist", 
            status: 404 })
        }

    }
    catch (err) {
        return res.status(500).send({
            message: err.message,
            status: 0
        })
    }


}

const commentsonPost = async (req, res, next) => {
    try {
        const user = req.body.user
        const group = req.body.group
        const post = req.body.post
        const comments = req.body.comments

        const data = await groupModel.findById({ _id: group })
        const memberIds = data.members.map(member => member.toString());
        

        if (memberIds.includes(user)) {
            
            const commentPost = await postModel.findOneAndUpdate(
                { _id: post },
                { $push: { comments: { user: user, text: comments } } },
                { new: true }
            );
            return res.status(200).send({
                message: "Comments on Post Successfully",
                status: 1,
                data: commentPost
            })
        }
        else{
            res.send(404, { message: "member doesnt exist", 
            status: 404 })
        }

    }
    catch (err) {
        return res.status(500).send({
            message: err.message,
            status: 0
        })
    }
}

const getPost = async (req, res, next) => {
    const group = req.body.group
    const id = new mongoose.Types.ObjectId(group)

    try{
        const data = [
            {
                '$match': {
                  'group': id, 
                  'isreported': false
                }
              }, {
                '$group': {
                  '_id': id, 
                  '_id': {
                    'name': '$name', 
                    'description': '$description', 
                    'post_image': '$post_image', 
                    'videos': '$videos', 
                    'issaved': '$issaved', 
                    'isreported': '$isreported', 
                    'liked': '$liked', 
                    'comments': '$comments'
                  }
                }
              }, {
                '$unwind': {
                  'path': '$_id.liked'
                }
              }, {
                '$lookup': {
                  'from': 'users', 
                  'localField': '_id.liked._id', 
                  'foreignField': '_id', 
                  'as': 'result'
                }
              }, {
                '$unwind': {
                  'path': '$result'
                }
              }
        ]
        const getdata = await postModel.aggregate(data)
        console.log("data ....",getdata)
        const [_id, ...result] = getdata
        

        return res.status(200).send({
            message: "Post Retrieved Successfully",
            status: 1,
            data: getdata,
            likes:Object.keys(_id._id.liked).length,
            comments:_id._id.comments.length
        })
    }
    catch (err) {
        return res.status(500).send({
                    message: err.message,
                    status: 0
        })
    }
    

    
}


module.exports = {
    createpost,
    getPost,
    likedonPost,
    commentsonPost
}
