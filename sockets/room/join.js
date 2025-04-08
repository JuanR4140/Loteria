let sanitizer = require("sanitizer");

let shuffleCards = (deck) => {
    for(let i = deck.length - 1; i > 0; i--){
        let j = Math.floor(Math.random() * (i + 1));
        let tmp = deck[i];
        deck[i] = deck[j];
        deck[j] = tmp;
    }
}

module.exports = (socket, games) => {
    socket.on("room:join", (data) => {
        if(!games[data.room_code]){
            socket.emit("room:join", {
                success: 0,
                message: "Room not found!"
            });
            return;
        }

        if(games[data.room_code].room_locked){
            socket.emit("room:join", {
                success: 0,
                message: "Can't join room. Game in progress!"
            });
            return;
        }

        data.display_name = sanitizer.sanitize(data.display_name);

        if(data.display_name.length > 25){
            socket.emit("room:join", {
                success: 0,
                message: "Display name can't be longer than 25 characters!"
            });
        }

        let name_taken = false;
        for(const key in games[data.room_code].players){
            const value = games[data.room_code].players[key].display_name;
            if(value == data.display_name){
                name_taken = true;
                socket.emit("room:join", {
                    success: 0,
                    message: "Name taken!"
                });
                break;
            }
        }
        if(name_taken) return;

        board = [];
        for(let i = 0; i < 54; i++){
            board[i] = i;
        }
        shuffleCards(board);
        let b = board.slice(0, 16);

        games[data.room_code].players[socket.id] = {
            display_name: data.display_name,
            board: b,
            ready: false
        }

        socket.join(data.room_code);
        socket.emit("room:join", {
            success: 1,
            room_code: data.room_code,
            players: games[data.room_code].players
        });

        socket.to(data.room_code).emit("room:join:new", {
            display_name: data.display_name
        });

    });
}

