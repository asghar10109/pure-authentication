const express = require('express')
const cors = require('cors')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')

const { createServer } = require("http");
const { Server } = require("socket.io");

const { getmessage, sendmessage, getlastmessage, singlechat_get, singlechat_send } = require('./utilis/chat')


const httpServer = createServer(app);
const io = new Server(httpServer);

dotenv.config()
app.use(express.json());
app.use(cors())



const userRoutes = require('./routes/user')
app.use('/demo/user/', userRoutes)

const groupRoutes = require('./routes/group')
app.use('/demo/group/', groupRoutes)

const postRoutes = require('./routes/post')
app.use('/demo/post/', postRoutes)


const chatRoutes = require('./routes/chat')
app.use('/demo/chat/', chatRoutes)


app.use('/', express.static(process.cwd() + '/public'))

mongoose.connect(process.env.Db).then((res) => {
    console.log(`database is connect successfully`)
})
    .catch(err => {
        console.log(`database is not connect successfully`)
    })



io.on("connection", (socket) => {

    console.log("user connected for group chats")

    socket.on("getmessage", function (object) {
        var groupId = object.groupid

        //    console.log("group_id",groupId)
        socket.join(groupId)// room

        getmessage(object, function (response) {
            console.log("response", response)

            // const members_ids = response.map(ele =>ele.result._id.toString())
            // console.log("members_ids" ,members_ids)

            io.to(groupId).emit("message", {
                object_type: "getmessage",
                message: response
            })
        })

    })


    socket.on("sendmessage", function (object) {
        var groupId = object.groupid
        socket.join(groupId)
        sendmessage(object, function (response) {
            console.log("response", response)


            io.to(groupId).emit("message", {
                object_type: "sendmessage",
                message: response
            })
        })
    })


    socket.on("getlastmessage", function (object) {

        getlastmessage(object, function (response) {
            console.log("response", response)
            io.emit("message", {
                object_type: "getlastmessage",
                message: response
            })

        })
    })

    socket.on("singlechat_get", function (object) {
        const senderid = object.senderid
        const roomname = `room${senderid}`
        socket.join(roomname)
        singlechat_get(object, function (response) {
            console.log("response", response._id)
            io.to(roomname).emit("message", {
                object_type: "getmessage",
                message: response
            })
        })  
    })

    socket.on("singlechat_send", function (object) {
        const senderid = object.senderid
        const roomname = `room${senderid}`
        socket.join(roomname)
        singlechat_send(object, function (response) {
            console.log(response, "response._id") 
            io.to(roomname).emit("message", {
                object_type: "sendmessage",
                message: response
            })  
        })
    })


    socket.on("disconnect", () => {
        console.log("disconnect")
    })

});







httpServer.listen(process.env.Port, () => {
    console.log(`server is running is on port ${process.env.Port}`)
})