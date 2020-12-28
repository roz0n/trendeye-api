import { Request, Response } from "express";
import { Router } from "express";
import { TrendScraper } from "../services/scraper/scraper.service";

const router = Router();
const scraper = new TrendScraper();

router.get("/", async (req: Request, res: Response) => {
  try {
    const response = await scraper.getAllTrends();
    res.send({ success: true, data: response });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

// router.get("/:name");

export { router };
