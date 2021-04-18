import { Request, Response } from "express";
import { Router } from "express";
import cache from "../cache";
import cacheRoute, { TTL } from "../middleware/cacheRoute.middleware";
import CategoriesController from "../controllers/categories.controller";

const router = Router();
const scraper = new CategoriesController();

router.use(cacheRoute);

router.get("/list", async (req: Request, res: Response) => {
  try {
    const response = await scraper.getCategoriesList();

    cache.setex(req.originalUrl, TTL, JSON.stringify(response));
    res.send({ success: true, data: response });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

router.get("/desc/:name", async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const response = await scraper.getCategoryDescription(name);

    // cache.setex(req.originalUrl, TTL, JSON.stringify(response));
    res.send({ success: true, data: response });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

router.get("/:name", async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const { limit } = req.query;
    const response = await scraper.getCategoryByName(name, +limit!);

    cache.setex(req.originalUrl, TTL, JSON.stringify(response));
    res.send({ success: true, limit, data: response });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

export { router };
