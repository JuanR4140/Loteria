const path = require("path");

let dir = path.join(__dirname + "/../public/");

const ejsData = {};
const RenderFile = (res, file, data) => {
    let fullEjsData = { ...ejsData, ...data };
    res.render(`${dir}${file}.html`, fullEjsData);
}

let registerRoutes = (app) => {
    app.get("/", (req, res) => {
        RenderFile(res, "index");
    });

    app.get("/game/:room_code", (req, res) => {
        RenderFile(res, "game/game");
    });
}

module.exports = {
    registerRoutes
}
