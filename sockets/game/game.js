let drawCard = (io, games, room_code) => {
    let game = games[room_code];

    if(game === undefined) return;

    if(!game.in_progress || game.deck.length == 0){
        return;
    }

    // let drawn_card = game.deck.pop();
    games[room_code].revealed_deck.push(games[room_code].deck.pop());

    game.any_reply = false;
    io.to(room_code).emit("game:new_card", {
        deck: games[room_code].revealed_deck
    });

    game.timer = setTimeout(() => drawCard(io, games, room_code), 8000);

    setTimeout(() => {
        if(!game.any_reply){
            delete games[room_code];
        }
    }, 5000);
}

module.exports = (io, socket, games, room_code) => {
    console.log(`game time!`);
    games[room_code].timer = setTimeout(() => drawCard(io, games, room_code), 10000);
}
