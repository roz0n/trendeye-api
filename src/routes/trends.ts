import { Request, Response } from "express";
import { Router } from "express";
import { TrendScraper } from "../controllers/ScraperController";

const router = Router();
const scraper = new TrendScraper();

router.get("/", async (req: Request, res: Response) => {
  try {
    const response = await scraper.getAllTrends();
    res.send({ success: true, data: response });
  } catch (error) {
    res.status(400).send({ error: true, message: error.message });
  }
});

// router.get("/:name");

export { router };
