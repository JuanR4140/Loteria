
module.exports = (socket, games) => {
    socket.on("room:leave", (data) => {
        if(!games[data.room_code]){
            socket.emit("room:leave", {
                success: 0,
                message: "Can't leave non-existent room!"
            });
            return;
        }

        if(games[data.room_code].host == socket.id){
            socket.to(data.room_code).emit("room:leave:host");
            socket.emit("room:leave", {
                success: 1,
            });

            delete games[data.room_code];
            return;
        }
        
        socket.leave(data.room_code);
        delete games[data.room_code].players[socket.id];

        socket.emit("room:leave", {
            success: 1,
        });

        socket.to(data.room_code).emit("room:leave:new", {
            players: games[data.room_code].players
        });

    });
}

