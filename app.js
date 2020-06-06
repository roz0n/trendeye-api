const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const studiosRouter = require("./routes/studios");
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/studios", studiosRouter);

module.exports = app;