const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:3001']
    }
});

io.on('connection', socket => {
    console.log(socket.id);
    socket.on("send-message", (message, room) => {

        // ################
        // io.emit("receive-message", message); // io.emit sends request to all of the different clients, including the client that actually made the request in the first place

        // ################
        // socket.broadcast.emit("receive-message", message); // this means, I am gonna take our current socket and from that socket, I am gonna broadcast the message to every other socket but not the current one!

        // ################
        // built-in room
        // one on one
        // every id is a separate room by default
        if (room === '') { // means we do not have a room
            socket.broadcast.emit("receive-message", message); // so we broadcast to everyone
        } else { // means we do have a room
            socket.to(room).emit("receive-message", message); // so we broadcast to only the ones in that room
            // .to(room) does the job of .broadcast
        }
    });


    // ################
    // custom room
    // send to multiple people, but not to everyone
    // you cannot join a room from the client
    // you need to tell (me) the server you are gonna join a room and (I) the server will be listening
    socket.on("join-room", (room, cb) => {
        socket.join(room);
        cb(`Joined room ${room}`)
    })

    // ###############
    // one additional thing that you can do with socket.on() and socket.emit() is that (shown above)
    // you can pass them a callback function. 
    // this callback function is going to get called 
    // from the server back down to the client
    // the callback function must be the last thing you pass to .emit()
    // 1. one great use-case is that if you want to do something and tell the user the thing was successful, for example, joining a room.
    // 2. another use-case is that if you want to have a messaging system where you would tell the user once the message was sent. the callback could be used to verify that the message was sent
})