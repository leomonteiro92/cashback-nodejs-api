const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

require("./database");
app.oauth = require("./middlewares/oauth");
app.post("/token", app.oauth.token());
require("./routes")(app);

module.exports = app;
