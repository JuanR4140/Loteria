module.exports = (socket, games) => {
    socket.on("game:ping", (data) => {
        let game = games[data.room_code];

        if(game === undefined) return;

        game.any_reply = true;
    });
}
