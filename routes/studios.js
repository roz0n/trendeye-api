const express = require('express');
const router = express.Router();

const Scrape = require("../utils/Scraper");

router.get("/", async (req, res) => {
  try {
    const response = await Scrape.studios;
    res.status(200).send({ success: true, data: response });
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
});

module.exports = router;