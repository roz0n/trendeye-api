import { Request, Response } from "express";
import { Router } from "express";
import { LatestScraper } from "../controllers/ScraperController";

const router = Router();
const scraper = new LatestScraper();

router.get("/", async (req: Request, res: Response) => {
  try {
    const response = await scraper.getLatestPosts();
    console.log("Response:", response);
    // Await Scraper Util get method
    // Respond with resource


    res.send({ success: true, data: response });
  } catch (error) {
    res.status(400).send({ error: true, message: error.message });
  }
});

// router.get("/:name");

export { router };
