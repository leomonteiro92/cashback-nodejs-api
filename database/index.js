const mongoose = require("mongoose");
const DB_URL =
  process.env.DB_URL ||
  "mongodb://buguento:gch0102l28@ds159217.mlab.com:59217/beth";

mongoose.connect(DB_URL, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", err => {
  console.error(`An error has occurred in the connection ${err.message}`);
});

db.on("open", () => {
  console.log(`Connection established successfully`);
});

module.exports = { db };
