const express = require("express");
const router = express.Router();
const ScrapeUtils = require("../utils/Scraper");
const { StudioScraper } = ScrapeUtils;

router.get("/", async (req, res) => {
  try {
    const response = await StudioScraper.all();
    res.send({ success: true, data: response });
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
});

router.get("/:name", async (req, res) => {
  try {
    const {name} = req.params;
    if (!name) throw new Error("No studio name provided");
    
    const response = await StudioScraper.byName(req.params.name);
    res.send({ success: true, data: response });
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
});

module.exports = router;
