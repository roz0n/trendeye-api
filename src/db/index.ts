const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASS = process.env.MONGO_PASS;
const MONGO_URI = process.env.MONGO_URI;
const MONGO_DATABASE = process.env.MONGO_DATABASE;

const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_URI}.mongodb.net/${MONGO_DATABASE}?retryWrites=true&w=majority`;
const db = require("monk")(uri);

db.then(() => {
  console.log("Successfully connected to MongoDB");
});

process.on("SIGINT", async () => {
  await db.close();
  console.log("MongoDB connection closed gracefully");
  process.exit(0);
});

module.exports = db;
