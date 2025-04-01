module.exports = (socket, games) => {
    socket.on("game:validate_session", (data) => {
        if(!games[data.room_code]){
            socket.emit("game:validate_session", {
                success: 0,
                message: "Room not found!"
            });
            return;
        }

        console.log(`Checking if ${data.old_id} is in player list...`);
        
        if(!(data.old_id in games[data.room_code].players)){
            socket.emit("game:validate_session", {
                success: 0,
                message: "You are not a part of this game!"
            });
            return;
        }

        // Convert old socket id to new one, then delete the old socket
        games[data.room_code].players[socket.id] = games[data.room_code].players[data.old_id];
        delete games[data.room_code].players[data.old_id];
        socket.join(data.room_code);

        // If the player isn't ready, initialize everything
        if(!(games[data.room_code].players[socket.id].ready)){
            // Announce socket is ready
            games[data.room_code].players[socket.id].ready = true;
        }

        socket.emit("game:validate_session", {
            success: 1,
            board: games[data.room_code].players[socket.id].board
        });


    });
}
