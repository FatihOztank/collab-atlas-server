let express = require('express');
let app = express();
let httpServer = require("http").createServer(app);
let io = require("socket.io")(httpServer);

let connections = []

io.on("connect", (socket) => {
    connections.push(socket);
    console.log(socket.id, "has connected");

    socket.on("mousedown", (data) => {
        let id = socket.id;
        let selectorString = data.selectorString;
        let iframeIndex = data.iframeIndex;
        socket.broadcast.emit("eventrecord", {
            id, selectorString, iframeIndex
        })
    });

    socket.on("mousemove", (data) => {
        const x = data.x;
        const y = data.y;
        const id = socket.id;
        const iframeIndex = data.iframeIndex;
        socket.broadcast.emit("locationrecord", {
            id, x, y, iframeIndex
        })
    })

    socket.on("mousewheel", (data) => {
        const scrollY = data.scrollY;
        const iframeIndex = data.iframeIndex;
        const scaledX = data.scaledX;
        const scaledY = data.scaledY;

        socket.broadcast.emit("scrollrecord", {
            scrollY, scaledX, scaledY, iframeIndex
        })
    })


    socket.on("addedmutationrecord", (record) => {
        const mutationTarget = record.mutationTarget;
        const addedElemHTML = record.addedElemHTML;
        const iframeIndex = record.iframeIndex;
        socket.broadcast.emit("addedmutation", {
            mutationTarget, addedElemHTML, iframeIndex
        });
    });

    socket.on("removedmutationrecord", (record) => {
        const iframeIndex = record.iframeIndex;
        socket.broadcast.emit("deletemutations", { iframeIndex });

    });

    socket.on("modifiedAttributeRecord", (record) => {
        const changedAttribute = record.changedAttribute;
        const mutationTarget = record.mutationTarget;
        const mutationValue = record.mutationValue;
        const mutatedElemHTML = record.mutatedElemHTML;
        const iframeIndex = record.iframeIndex;
        socket.broadcast.emit("attributeModify", {
            changedAttribute, mutationTarget, mutationValue, mutatedElemHTML, iframeIndex
        });

    })

    socket.on("disconnect", (reason) => {
        connections = connections.filter(con => con.id !== socket.id);
        console.log(socket.id, "has disconnected");

    });

    socket.on("opensecondiframe", () => {
        socket.broadcast.emit("secondiframeopened", {});
    })
});

let PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
    console.log(`server started listening port ${PORT}`)
});