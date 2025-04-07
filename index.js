const ejs = require("ejs");
const express = require("express");

let games = {};
/*

let games = {
    "ABC123": {
        in_progress: true,
        host: "socket-id",
        deck: [0...53],
        players: {
            "socket-id": {
                "display_name": "juan",
                board: [0...15]
            },
            "socket-id": {
                "display_name": "john",
                board: [0...15]
            },
            "socket-id": {
                "display_name": "jane",
                board: [0...15]
            }
        }
    }
};

*/

const PORT = 3000;

const app = express();
app.disable("x-powered-by");

app.engine("html", ejs.renderFile);
app.use(express.static("./public"));

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
});

const io = require("socket.io")(server);

io.on("connection", (socket) => {
    require("./sockets/room/create.js")(socket, games);
    require("./sockets/room/join.js")(socket, games);
    require("./sockets/room/leave.js")(socket, games);
    require("./sockets/room/start.js")(io, socket, games);

    require("./sockets/game/validate_session.js")(io, socket, games);
    require("./sockets/game/check_win.js")(io, socket, games);
    require("./sockets/game/ping.js")(socket, games);
});

const { registerRoutes } = require("./routes/routes.js");
registerRoutes(app);

