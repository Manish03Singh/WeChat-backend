const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoute = require('./routes/userRoute')
const MsgRoute = require('./routes/messagesRoute')
const app = express();
const socket = require('socket.io');

require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use("/api/auth", userRoute)
app.use("/api/messages", MsgRoute)
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


mongoose.connect(process.env.MONNGO_DB_URL,{
    // useNewUrlParser : true,
    // useUnifiedTopology : true,
}).then(() => {
    console.log(`DB connection successful`)
}).catch(err => {
    console.log(`Error in connection with databse. ${err}`)
})

port = process.env.PORT || 8000;

const server = app.listen(port,() => {
    console.log(`Server is running on port ${port}`);
});

const io = socket(server, {
    cors : {
        origin : process.env.CLIENT_URL,
        credentials: true,
    }
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.message);
        }
    });
});