import { Request, Response } from "express";
import { Router } from "express";
import LatestPostsScraper from "../services/LatestPostsScraper";

const router = Router();
const scraper = new LatestPostsScraper();

router.get("/", async (req: Request, res: Response) => {
  try {
    const data = await scraper.getLatestPosts();
    res.send({ success: true, data: data });
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
});

export { router };