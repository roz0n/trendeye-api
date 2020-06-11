import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import studiosRouter from "./routes/studios";
// import trendsRouter from "./routes/trends";

const app = express();
const PORT = 3001;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/studios", studiosRouter);
// app.use("/trends", trendsRouter);

app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`))

export default app;