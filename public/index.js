let socket = io.connect();
console.log("sock inited");

// clean all local storage info. (server deck, chosen board pieces, etc)
localStorage.clear();

document.querySelector("#create-room-btn").addEventListener("click", () => {
    console.log("sent sock create request");
    socket.emit("room:create", {
        display_name: document.querySelector("#display-name-txt").value
    });
});

document.querySelector("#join-room-btn").addEventListener("click", () => {
    console.log("sent sock join request");
    socket.emit("room:join", {
        display_name: document.querySelector("#display-name-txt").value,
        room_code: document.querySelector("#join-room-txt").value
    });
});

document.querySelector("#start-game-btn").addEventListener("click", () => {
    socket.emit("room:start", {
        room_code: document.querySelector("#room-code-txt").innerText.slice(-6)
    });
});

document.querySelector("#leave-game-btn").addEventListener("click", () => {
    console.log("sent sock leave request");
    socket.emit("room:leave", {
        room_code: document.querySelector("#room-code-txt").innerText.slice(-6)
    });

    document.querySelector("#join-room-txt").value = "";
});

socket.on("room:create", (data) => {
    if(!data.success){
        alert(data.message);
        return;
    }

    console.log("room created");

    document.querySelector("#room-code-txt").innerText = `You are in room ${data.room_code}`;
    
    let player_list = document.querySelector("#player-list-div");
    let p = document.createElement("p");
    p.setAttribute("id", "You");
    p.innerText = "You";
    player_list.appendChild(p);

    document.querySelector("#menu-div").style.display = "none";
    document.querySelector("#room-div").style.display = "block";
});

socket.on("room:start", (data) => {
    console.log(data);
    localStorage.setItem("socket_id", socket.id);
    console.log(`Set item ${socket.id}`);
    if(!data.success){
        alert(data.message);
        return;
    }
    window.location.href = data.url;
});

socket.on("room:join", (data) => {
    if(!data.success){
        alert(data.message);
        return;
    }

    console.log("room joined");

    delete data.players[socket.id];

    document.querySelector("#room-code-txt").innerText = `You are in room ${data.room_code}`;

    let player_list = document.querySelector("#player-list-div");
    let p = document.createElement("p");
    p.setAttribute("id", "You");
    p.innerText = "You";
    player_list.appendChild(p);

    for(const player in data.players){
        const info = data.players[player];
        let pl = document.createElement("p");
        pl.setAttribute("id", info["display_name"]);
        pl.innerText = info["display_name"];
        player_list.appendChild(pl);
    }

    document.querySelector("#menu-div").style.display = "none";
    document.querySelector("#room-div").style.display = "block";
    
});

socket.on("room:join:new", (data) => {
    let player_list = document.querySelector("#player-list-div");
    let p = document.createElement("p");
    p.setAttribute("id", data.display_name);
    p.innerText = data.display_name;
    player_list.append(p);
});

socket.on("room:leave", (data) => {
    if(!data.success){
        alert(data.message);
        return;
    }

    console.log("room left");

    let player_list = document.querySelector("#player-list-div");

    while(player_list.firstChild){
        player_list.removeChild(player_list.firstChild);
    }

    document.querySelector("#menu-div").style.display = "block";
    document.querySelector("#room-div").style.display = "none";

});

socket.on("room:leave:new", (data) => {
    delete data.players[socket.id];

    let player_list = document.querySelector("#player-list-div");

    while(player_list.firstChild){
        player_list.removeChild(player_list.firstChild);
    }

    let p = document.createElement("p");
    p.setAttribute("id", "You");
    p.innerText = "You";
    player_list.appendChild(p);

    for(const player in data.players){
        const info = data.players[player];
        let pl = document.createElement("p");
        pl.setAttribute("id", info["display_name"]);
        pl.innerText = info["display_name"];
        player_list.appendChild(pl);
    }

});

socket.on("room:leave:host", () => {
    alert("The host has shut down the room.");
    let player_list = document.querySelector("#player-list-div");

    while(player_list.firstChild){
        player_list.removeChild(player_list.firstChild);
    }

    document.querySelector("#menu-div").style.display = "block";
    document.querySelector("#room-div").style.display = "none";

});

