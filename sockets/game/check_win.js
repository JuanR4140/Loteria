let checkWin = (board_state, server_board, revealed_deck) => {
    const winning_conditions = [
        // Rows
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15],

        // Columns
        [0, 4, 8, 12],
        [1, 5, 9, 13],
        [2, 6, 10, 14],
        [3, 7, 11, 15],

        // Diagonals
        [0, 5, 10, 15],
        [3, 6, 9, 12],

        // Corners
        [0, 3, 12, 15],

        // Center 4
        [5, 6, 9, 10]
    ]

    for(let condition of winning_conditions){
        let match = true;
        for(let i = 0; i < condition.length; i++){
            if(board_state[condition[i]] == 0){
                match = false;
            }
        }

        if(!match){
            continue;
        }

        let player_deck = [];

        for(let i = 0; i < 4; i++){
            player_deck.push(server_board[condition[i]]);
        }

        if(player_deck.every(card => revealed_deck.includes(card))){
            return true;
        }

    }

    return false;

}

module.exports = (io, socket, games) => {
    socket.on("game:check_win", (data) => {
        let game = games[data.room_code];

        if(game === undefined) return;
        if(game.players[socket.id].board === undefined) return;

        if(checkWin(data.board_state, game.players[socket.id].board, game.revealed_deck)){
            io.emit("game:check_win", game.players[socket.id].display_name);
            game.timer = null;
            delete games[data.room_code];
        }
    });
}
