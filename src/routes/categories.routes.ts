import { Request, Response } from "express";
import { Router } from "express";
import cache from "../cache";
import cacheRoute from "../middleware/cacheRoute.middleware";
import CategoriesController from "../controllers/categories.controller";

const router = Router();
const scraper = new CategoriesController();

router.use(cacheRoute);

router.get("/:name", async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const { limit } = req.query;
    const response = await scraper.getCategoryByName(name, +limit!);

    cache.setex(req.originalUrl, 3600, JSON.stringify(response));
    res.send({ success: true, limit, data: response });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

export { router };
