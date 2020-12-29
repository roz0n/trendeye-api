import { Request, Response, Router } from "express";
import cache from "../cache";
import cacheRoute from "../middleware/cacheRoute.middleware";
import StudiosController from "../controllers/studios.controller";

const router = Router();
const scraper = new StudiosController();

router.use(cacheRoute);

router.get("/", async (req: Request, res: Response) => {
  try {
    const response = await scraper.getAllStudios();

    cache.setex(req.originalUrl, 3600, JSON.stringify(response));
    res.send({ success: true, data: response });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

router.get("/countries", async (req: Request, res: Response) => {
  try {
    const response = await scraper.getStudioCountries();

    cache.setex(req.originalUrl, 3600, JSON.stringify(response));
    res.send({ success: true, data: response });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

router.get("/:country", async (req: Request, res: Response) => {
  try {
    const { country } = req.params;
    const response = await scraper.getStudiosByCountry(country);

    cache.setex(req.originalUrl, 3600, JSON.stringify(response));
    res.send({ success: true, data: response });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

router.get("/single/:name", async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const response = await scraper.getStudioByName(name);

    cache.setex(req.originalUrl, 3600, JSON.stringify(response));
    res.send({ success: true, data: response });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

export { router };
