const crypto = require("crypto");

let generateToken = (length) => {
    return crypto.randomBytes(length).toString("hex").toUpperCase();
}

let shuffleCards = (deck) => {
    for(let i = deck.length - 1; i > 0; i--){
        let j = Math.floor(Math.random() * (i + 1));
        let tmp = deck[i];
        deck[i] = deck[j];
        deck[j] = tmp;
    }
}

module.exports = (socket, games) => {
    socket.on("room:create", (data) => {
        room_code = generateToken(3);

        deck = []
        for(let i = 0; i < 54; i++){
            deck[i] = i;
        }
        shuffleCards(deck);

        board = []
        for(let i = 0; i < 54; i++){
            board[i] = i;
        }
        shuffleCards(board);
        let b = board.slice(0, 16);

        games[room_code] = {
            room_locked: false,
            in_progress: false,
            host: socket.id,
            deck: deck,
            revealed_deck: [],
            players: {}
        }

        games[room_code].players[socket.id] = {
            display_name: data.display_name,
            board: b,
            ready: false
        }

        socket.join(room_code);

        socket.emit("room:create", {
            success: 1,
            room_code: room_code
        });

        console.log("sent back data create");

    });
}

