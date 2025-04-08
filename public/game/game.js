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

let placed_beans = [];
if(!(localStorage.getItem("placed_beans") === null)){
    placed_beans = JSON.parse(localStorage.getItem("placed_beans"));
    for(const placed_bean of placed_beans){

        const el = document.querySelector(`#board-${placed_bean}`);
        const rect = el.getBoundingClientRect();

        let bean = document.createElement("img");
        bean.src = "assets/images/bean.png";
        bean.style.transform = `rotate(${Math.floor(Math.random() * 360) + 1}deg)`;
        bean.classList.add("bean");

        let centerX = rect.left + rect.width / 2 - (el.width / 2);
        let centerY = rect.top + rect.height / 2 - (el.height / 2);
        centerX += (Math.floor(Math.random() * 30) + 1);
        centerY += (Math.floor(Math.random() * 90) + 1);

        let left_pos = `${centerX + window.scrollX}px`; // let left_pos = `${(child.x + child.width) - (child.width / 2)}px`
        let top_pos = `${centerY + window.scrollY}px`; // let top_pos = `${(child.y + child.height) + (child.height / 2)}px`;

        bean.style.left = left_pos;
        bean.style.top = top_pos;
        document.body.append(bean);

    }

}

let chosen_cards = [];
if(!(localStorage.getItem("chosen_cards") === null)){
    chosen_cards = JSON.parse(localStorage.getItem("chosen_cards"));
}

let revealed_deck = [];
if(!(localStorage.getItem("revealed_deck") === null)){
    revealed_deck = JSON.parse(localStorage.getItem("revealed_deck"));
}

document.querySelector("#buenas-btn").addEventListener("click", () => {
    let beans = placed_beans.map(Number);
    let board_state = new Array(16).fill(0);

    beans.forEach((bean) => {
        if(bean >= 0 && bean <= 15){
            board_state[bean] = 1;
        }
    });

    socket.emit("game:check_win", {
        room_code: room_code,
        board_state: board_state
    });
});

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

    console.log(data.board);
    for(let i = 0; i < data.board.length; i++){
        document.querySelector(`#board-${i}`).src = `assets/images/${data.board[i]}.jpg`;
    }

    for(const child of document.querySelector("#board").children){
        child.addEventListener("click", (e) => {
            let card_number = parseInt(child.src.split("/")[6].split(".")[0]);
            const rect = child.getBoundingClientRect();

            if(revealed_deck.includes(card_number) && !(chosen_cards.includes(card_number))){

                chosen_cards.push(card_number);
                localStorage.setItem("chosen_cards", JSON.stringify(chosen_cards));

                placed_beans.push(child.id.split("-")[1]);
                localStorage.setItem("placed_beans", JSON.stringify(placed_beans));

                console.log(placed_beans);
                console.log(chosen_cards);

                let bean = document.createElement("img");
                bean.src = "assets/images/bean.png";
                bean.style.transform = `rotate(${Math.floor(Math.random() * 360) + 1}deg)`;
                bean.classList.add("bean");

                let centerX = rect.left + rect.width / 2 - (child.width / 2);
                let centerY = rect.top + rect.height / 2 - (child.height / 2);
                centerX += (Math.floor(Math.random() * 30) + 1);
                centerY += (Math.floor(Math.random() * 90) + 1);

                let left_pos = `${centerX + window.scrollX}px`; // let left_pos = `${(child.x + child.width) - (child.width / 2)}px`
                let top_pos = `${centerY + window.scrollY}px`; // let top_pos = `${(child.y + child.height) + (child.height / 2)}px`;

                bean.style.left = left_pos;
                bean.style.top = top_pos;
                document.body.append(bean);
            }
        });
    }

});


socket.on("game:new_card", (data) => {

    socket.emit("game:ping", {
        room_code: room_code
    });

    revealed_deck = data.deck;
    localStorage.setItem("revealed_deck", JSON.stringify(revealed_deck));
    console.log(revealed_deck);
    
    let announcement_card = document.querySelector("#announcement-card");
    let board = document.querySelector("#board-0");

    let r = board.getBoundingClientRect();

    let width_calc = (r.width * 4) + (5 * 4);
    let height_calc = (r.height * 4) + (5 * 4);

    let new_card = new Image();
    new_card.src = `assets/images/${revealed_deck[revealed_deck.length - 1]}.jpg`;

    new_card.onload = () => {
        announcement_card.src = new_card.src;
        announcement_card.classList.add("announcement-card-anim");

        setTimeout(() => {
            announcement_card.classList.remove("announcement-card-anim");
        }, 3000);

        announcement_card.style.width = `${width_calc}px`;
        announcement_card.style.height = `${height_calc}px`;

        announcement_card.style.left = `${r.left + window.scrollX}px`;
        announcement_card.style.top = `${r.top + window.scrollY}px`;
    }

    /*
    announcement_card.classList.add("announcement-card-anim");
    
    setTimeout(() => {
        announcement_card.classList.remove("announcement-card-anim");
    }, 3000);
    
    announcement_card.style.width = `${width_calc}px`;
    announcement_card.style.height = `${height_calc}px`;

    announcement_card.src = `assets/images/${revealed_deck[revealed_deck.length - 1]}.jpg`;
    announcement_card.style.left = `${r.left + window.scrollX}px`;
    announcement_card.style.top = `${r.top + window.scrollY}px`;
    */
});

socket.on("game:check_win", (winner) => {
    alert(`Buenas! ${winner} won the game!`);
    window.location.href = "/";
});
