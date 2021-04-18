import { Request, Response } from "express";
import { Router } from "express";
import LatestPostsController from "../controllers/latestPosts.controller";

const router = Router();
const scraper = new LatestPostsController();

router.get("/", async (req: Request, res: Response) => {
  try {
    const data = await scraper.getLatestPosts();
    res.send({ success: true, data: data });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

export { router };