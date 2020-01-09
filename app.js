const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require("./database");
app.oauth = require("./middlewares/oauth");
app.post("/token", app.oauth.token());
require("./routes")(app);

module.exports = app;
