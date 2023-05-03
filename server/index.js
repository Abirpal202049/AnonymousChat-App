const express = require('express')
const app = express()
const http = require('http') // Ceating a instance of http liabry
const {Server} = require('socket.io')
const cors = require('cors')


// Middleware
app.use(cors())

const server = http.createServer(app) // Creating a server

// This variable `io` help us to work with socket.io
const io = new Server(server, {
    cors : {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

// Connecting
io.on("connection", (socket) => {
    console.log(`User Connected : ${socket.id}`);

    // Listening ===> Reciving (from Frontend) 2
    socket.on("send_message", (data) => {
        console.log("Data : ", data);

        // Emiting ===> Sending (to Frontend) 3
        socket.broadcast.emit("recive_message", data)


        // io.emit("recive_message", data) => Better Way
    })
})

server.listen(process.env.PORT || 3001, ()=>{
    console.log("Server is running...");
})
