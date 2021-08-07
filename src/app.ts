import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { router as studiosRouter } from "./routes/studios.route";
import { router as categoriesRouter } from "./routes/categories.route";
import { router as latestRouter } from "./routes/latestPosts.route";
import { router as feedbackRouter } from "./routes/feedback.route";

require("./db");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(morgan("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  bodyParser.json({
    limit: "50mb",
  })
);

app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    parameterLimit: 100000,
    extended: true,
  })
);

app.use("/latest", latestRouter);
app.use("/categories", categoriesRouter);
app.use("/studios", studiosRouter);
app.use("/feedback", feedbackRouter);

app.listen(PORT, () =>
  console.log(`🔵 Trendlist API listening at http://localhost:${PORT}`)
);

export default app;
