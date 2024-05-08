const express =require('express');
const app= express();
require('dotenv').config();
const PORT=process.env.PORT || 7000;
const cors=require('cors');
const  dbConnect  = require('./Config/db');
const authRoutes=require('./routes/userRoutes')
const chatRoutes=require('./routes/chatRoutes')
const messageRoutes=require('./routes/messageRoute')

const { notFound, errorHandler } = require("./Middleware/errorMiddleware");



app.use(cors())
app.use(express.json());


dbConnect();

app.use('/api/v1',authRoutes)
app.use("/chats", chatRoutes);
app.use("/message", messageRoutes);

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);


const server=app.listen(PORT,()=>{
    console.log(`Server start at http://localhost:${PORT}`);
});

const io = require("socket.io")(server, {
  
    cors: {
      origin: "*",
      
      // credentials: true,
    },
    pingTimeout: 600,
  });
  
  io.on("connection", (socket) => {

    console.log("Connected to socket.io");
    socket.on("setup", (user) => {
      socket.join(user._id);
      socket.emit("connected");
    });
  
    socket.on("join chat", (room) => {
      socket.join(room);
      // console.log("User Joined Room: " + room);
    });
    // socket.on("typing", (room) => socket.in(room).emit("typing"));
    // socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  
    socket.on("new message", (newMessageRecieved) => {
      var chat = newMessageRecieved.chat;
  
      if (!chat.users) {
        return console.log("chat.users not defined")
    }
  
      chat.users.forEach((user) => {
        if (user._id == newMessageRecieved.sender._id) return;
  
        socket.in(user._id).emit("message recieved", newMessageRecieved);
      });
    });
  
    
    

  });
  // Auth urls 
  // http://localhost:7000/api/v1/auth/signup
  // http://localhost:7000/api/v1/auth/login
  // http://localhost:7000/api/v1/auth/user

  // Chat urls 
  // http://localhost:7000/chats/

  // Message Url
 
  // http://localhost:7000/message/:chatId
  //http://localhost:7000/message/

 
  