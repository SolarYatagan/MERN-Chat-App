const express = require('express');
const app = express();
const connectDB = require('./config/db');

require('dotenv').config()

const colors = require('colors')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const notificationsRoutes = require('./routes/notificationsRoutes')
const { notFound, errorHandler } = require('./middleware/middlewareError');
connectDB()

const port = process.env.PORT || 5000
/* const socket, selectedChatCompare; */
app.use(express.json()) //we take our values from frontend, we need to
                        //accept the the json from express 

/* app.get('/', (req, res)=>{
    res.send("Hello")
}) */

app.use('/api/user', userRoutes) //app.use(middleware) is called every time a request is sent to the server. 
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)
app.use('/api/notifications', notificationsRoutes)

app.use(notFound)//api error handling
app.use(errorHandler)



const server = app.listen(port, ()=>{
    console.log(`Server starts at port ${port}`.green.bold)
})

const io = require('socket.io')(server, {
    cors: { // it is a security mechanism that allows a web page from one domain to access a resource with a different domain 
        origin: 'http://localhost:3000',
    },
    
})

io.on('connection', (socket) => {
    
    socket.on('setup', (userData) => {
        socket.join(userData._id) //creating a room for user
        socket.emit('connected') //allows to emit customs events on the server and client
    })
    socket.on('join_chat', (room) => {
        socket.join(room)
    })

    socket.on('typing', (room) => socket.in(room).emit('typing'))
    socket.on('stop_typing', (room) => socket.in(room).emit('stop_typing'))
    
    .on('send_message', (message) => {
        let chat = message.chat

        if(!chat.users) return console.log("users are not defined")
    
        chat.users.forEach(user => {
            if(user._id === message.sender._id) return;

            socket.in(user._id).emit("message_received", message)
        });
    })

    socket.off('setup', () => {
        console.log("User disconected")
        socket.leave(userData._id)
    })
})

