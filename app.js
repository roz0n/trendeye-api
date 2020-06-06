const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const app = express();

const studiosRouter = require("./routes/studios");
const trendsRouter = require("./routes/trends");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/studios", studiosRouter);
app.use("/trends", trendsRouter);

module.exports = app;
