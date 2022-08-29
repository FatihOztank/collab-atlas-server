let express = require('express');
let app = express();
let httpServer = require("http").createServer(app);
let io = require("socket.io")(httpServer);

let connections = []

io.on("connect", (socket) => {
    connections.push(socket);
    console.log(socket.id ,"has connected");

    socket.on("mousedown", (data) => {
        // mousedown event will be fired by the client who was control on the table
        console.log(`client ${socket.id} has clicked ${
            data.x} and ${data.y}`);
        console.log(data.curr_mutation);
        let id = socket.id;
        let x = data.x;
        let y = data.y;
        socket.broadcast.emit("eventrecord", {
            id, x, y
        })
    });

    socket.on("mousemove", (data) => {
        const x  = data.x;
        const y = data.y;
        const id = socket.id;
        socket.broadcast.emit("locationrecord", {
            id,x,y
        })
    })


    socket.on("disconnect", (reason) => {
        connections = connections.filter(con => con.id !== socket.id);
        console.log(socket.id ,"has disconnected");

    });
});

let PORT = process.env.PORT || 8080;
httpServer.listen(PORT,()=>{
    console.log(`server started listening port ${PORT}`)
});