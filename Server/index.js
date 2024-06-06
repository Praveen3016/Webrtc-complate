const express = require('express');
const app = express();
const { Server } = require("socket.io");
const io = new Server(8000 , {
  cors : true ,
});

const emailToSocketIdMap = new Map()
const socketIdTOEmailMap = new Map()


io.on('connection', (socket) => {
    console.log('a user connected' ,socket.id);

    socket.on("room:join" , (data) =>{
     const {email , room }  =  data ;
     emailToSocketIdMap.set(email , socket.id);
     socketIdTOEmailMap.set(socket.id , email);
     io.to(room).emit("user:join" , {email , id:socket.id})
     socket.join(room)
     io.to(socket.id).emit("room:join" , {email,room });

    })


    socket.on("user:call" , ({to , offer}) =>{
      io.to(to).emit("incomming:call" , {from:socket.id , offer});  
    })

    socket.on("call:accepted" , ({to ,ans}) =>{
      io.to(to).emit("call:accepted" , {from:socket.id , ans});  

    })

    socket.on("peer:nego:needed" , ({to ,offer}) =>{
      console.log("peer:nego:needed" , offer)
      io.to(to).emit("peer:nego:needed" , {from:socket.id , offer});  

    })

    socket.on("peer.nego:done" , ({to ,ans}) =>{
      console.log("peer.nego:done" , ans);

      io.to(to).emit("peer:nego:final" , {from:socket.id , ans});  

    })
  });