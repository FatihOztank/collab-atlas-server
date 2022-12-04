let express = require('express');
let app = express();
let httpServer = require("http").createServer(app);
let io = require("socket.io")(httpServer);

let connections = []

io.on("connect", (socket) => {
    connections.push(socket);
    console.log(socket.id ,"has connected");

    socket.on("mousedown", (data) => {
        let id = socket.id;
        let x = data.x;
        let y = data.y;
        let selector_string = data.selector_string;
        socket.broadcast.emit("eventrecord", {
            id, x, y, selector_string
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

    socket.on("addedmutationrecord", (record) =>{
        const target = record.mutationtarget;
        const elemHTML = record.addedElemHTML;
        socket.broadcast.emit("addedmutation", {
            target, elemHTML
        });
    });

    socket.on("removedmutationrecord", () =>{
        socket.broadcast.emit("deletemutations", {});
    });

    socket.on("modifiedAttributeRecord", (record) => {
        const changedAttribute = record.changedAttribute;
        const mutationTarget = record.mutationTarget;
        const mutationValue = record.mutationValue;
        const mutatedElemHTML = record.mutatedElemHTML;
        socket.broadcast.emit("attributeModify", {
            changedAttribute, mutationTarget, mutationValue, mutatedElemHTML
        });
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