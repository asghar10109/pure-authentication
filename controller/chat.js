const chatModel = require('../model/chat')
const mongoose = require('mongoose')


const chatlist = async (req, res, next) => {
    const myid = req.body._id
    const data = await chatModel.find({ $or: [{ senderid: myid }, { receiverid: myid }] })


    var idlist = []
    const all_ids = data.reduce((ids, ele) => {
        if (ele.senderid && ids.indexOf(ele.senderid) === -1) {
            idlist.push(ele.senderid);
        }
        if (ele.receiverid && ids.indexOf(ele.receiverid) === -1) {
            idlist.push(ele.receiverid);
        }
        return idlist
    }, []);


    const diffids = all_ids.filter(ids => ids.toString() !== myid)


    console.log(diffids)


    const lastChats = await chatModel.aggregate([
        {
            $match:{
                $or:[{ senderid:{ $in: diffids }},{receiverid:{ $in: diffids }}] 
            }
        },
        {
            $sort:{
                createdAt:-1
            }
        },
        {
            $group:{
                _id: {
                    $cond:[{ $in:[ "$senderid" , diffids]},
                        "$senderid",
                        "$receiverid"
                    ]
                },
                lastmessage:{
                    $first:"$message"
                },
                createdAt: {
                    $first:"$createdAt"
                }

                
            }
        },
        {   
            $project:{
                _id:0,
                userid:'$_id',
                lastmessage:1,
                createdAt: 1

            }
        },
        {
            $lookup:{
                from:'users',
                localField:'userid',
                foreignField:'_id',
                as:'res'
            }
        },
        {
            $unwind:{
                path:'$res',
                
            }
        },
    
        {
            $addFields:{
                user:'$res._id',
                image:'$res.image',
                name:'$res.username',
                email:'$res.email',
                phone:'$res.phone',
                dob:'$res.dob',
                
            }
        },
        {
            $project:{
                _id:0,
                userid:'$user',
                lastmessage:1,
                createdAt: 1,
                image:1,
                name:1,
                email:1,
                phone:1,
                dob:1
            }
        }




        
    ]);

    console.log(lastChats);


    res.send({

        status: 200,
        message: "success",
        data: lastChats
    })

}



const imageupload_videoupload = async (req, res, next) => {

    try{

        const chat_images = req?.files?.chat_images?.map((data) => data?.path?.replace(/\\/g, "/"));
        const chat_videos = req?.files?.chat_videos?.map((data) => data?.path?.replace(/\\/g, "/"));
    
        const img_video = new chatModel({
            chat_images:chat_images,
            chat_videos:chat_videos
        })
        


        return res.status(200).send({
            message: "images and videos Created Successfully",
            status: 1,
            images: img_video.chat_images,
            videos: img_video.chat_videos
        })

    }
    catch(err){
        return res.status(400).send({
            message:err.message,
            status:0
        })
    }

}


module.exports = {
    chatlist,
    imageupload_videoupload

}