const express = require("express");
const router = express.Router();
const ScrapeUtils = require("../utils/Scraper");

router.get("/", async (req, res) => {
  try {
    const response = await ScrapeUtils.StudioScraper.allByCountry;
    res.send({ success: true, data: response });
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
});

module.exports = router;
