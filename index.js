let express = require('express');
let app = express();
let httpServer = require("http").createServer(app);
let io = require("socket.io")(httpServer);

let connections = []

io.on("connect", (socket) => {
    connections.push(socket);
    console.log(socket.id, "has connected");
    //checked
    socket.on("mousedown", (data) => {
        socket.broadcast.emit("eventrecord", {
            selectorString: data.selectorString, iframeIndex: data.iframeIndex
        })
    });
    // checked
    socket.on("mousemove", (data) => {
        socket.broadcast.emit("locationrecord", {
            x: data.x, y: data.y, iframeIndex: data.iframeIndex,
            isLocked: data.isLocked
        })
    })
    //checked
    socket.on("mousewheel", (data) => {
        socket.broadcast.emit("scrollrecord", {
            scrollY: data.scrollY, scaledX: data.scaledX, scaledY: data.scaledX,
            iframeIndex: data.iframeIndex
        })
    })
    //checked
    socket.on("canvasnavigation", (data) => {
        socket.broadcast.emit("canvasnavigationrecord", {
            canvasUrl: data.canvasUrl, iframeIndex: data.iframeIndex
        })
    })
    //checked
    socket.on("canvasclick", (data) => {
        socket.broadcast.emit("canvasclickrecord", {
            iframeIndex: data.iframeIndex,
            x: data.x,
            y: data.y
        })
    })

    socket.on("setLockState", (data) => {
        socket.broadcast.emit("setLockStateValue", {
            lockState: data.lockState, iframeIndex: data.iframeIndex
        })
    })

    socket.on("disconnect", (reason) => {
        connections = connections.filter(con => con.id !== socket.id);
        console.log(socket.id, "has disconnected");

    });

    socket.on("opensecondiframe", () => {
        socket.broadcast.emit("secondiframeopened", {});
    })

    socket.on("syncrequest", () => {
        socket.broadcast.emit("syncrequestrecord", {})
    })
});

let PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
    console.log(`server started listening port ${PORT}`)
});