module.exports = (io, socket, games) => {
    socket.on("room:start", (data) => {
        if(!games[data.room_code]){
            socket.emit("room:start", {
                success: 0,
                message: "Room not found!"
            });
            return;
        }

        if(games[data.room_code].host != socket.id){
            socket.emit("room:start", {
                success: 0,
                message: "Can't start game. You're not the host!"
            });
            return;
        }

        games[data.room_code].room_locked = true;

        // Game set to in progress, send all players to actual game page!
        io.to(data.room_code).emit("room:start", {
            success: 1,
            url: `/game/${data.room_code}`
        });

        // Have all sockets leave the room and disconnect gracefully. 
        // When the game starts, these old socket ids will be replaced 
        // by the new ones, and the new socket id will join the room instead.
        io.in(data.room_code).disconnectSockets(true);

    });
}
