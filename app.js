const express= require("express");
const socket=require("socket.io");
const app=express();
app.use(express.static("public"));
let port=process.env.PORT || 5000;
let server=app.listen(port,()=>{
    console.log("l t p"+port);
})
let io=socket(server);
io.on("connection",(socket)=>{
    console.log("made socket connection");
    socket.on("beginPath",(data)=>{
        io.sockets.emit("beginPath",data);

    })
    socket.on("drawStroke",(data)=>{
        io.sockets.emit("drawStroke",data);
        
    })
    socket.on("undoredoStroke",(data)=>{
        io.sockets.emit("undoRedoStroke",data);
        
    })
})