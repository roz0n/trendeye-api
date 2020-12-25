import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import {router as studiosRouter} from "./routes/studios.routes";
import {router as trendsRouter} from "./routes/trends.routes";
import {router as latestRouter} from "./routes/latestPosts.routes";

const app = express();
const PORT = 3001;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/latest", latestRouter);
app.use("/trends", trendsRouter);
// app.use("/countries", countriesRouter);
app.use("/studios", studiosRouter);


app.listen(PORT, () =>
  console.log(`🔵 Trendlist API listening at http://localhost:${PORT}`)
);

export default app;
