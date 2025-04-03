let socket = io.connect();
// Retrieve socket.id stored in localStorage.
// Use this instead of socket.id to communicate with server.
// This is because socket.id changes from index.html --> game.html
socket.user_id = localStorage.getItem("socket_id");
// let room_code = localStorage.getItem("room_code");
let room_code = window.location.href.split("/")[4];
console.log(socket.user_id);
console.log(localStorage.getItem("socket_id"));
console.log(`The old id is ${socket.user_id} and the new one is ${socket.id}`);

let revealed_deck = [];

socket.emit("game:validate_session", {
    old_id: socket.user_id,
    room_code: room_code
});

socket.on("game:validate_session", (data) => {
    if(!data.success){
        alert(data.message);
        window.location.href = "/";
        return;
    }

    localStorage.setItem("socket_id", socket.id);

    alert("Game will now start!");

    console.log(data.board);
    for(let i = 0; i < data.board.length; i++){
        document.querySelector(`#board-${i}`).src = `assets/images/${data.board[i]}.jpg`;
    }

});


socket.on("game:new_card", (data) => {
    revealed_deck = data.deck;
    console.log(revealed_deck);
});

