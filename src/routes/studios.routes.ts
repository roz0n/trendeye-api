import { Request, Response, Router } from "express";
import StudiosController from "../controllers/studios.controller";

const router = Router();
const scraper = new StudiosController();

router.get("/", async (req: Request, res: Response) => {
  try {
    const response = await scraper.getAllStudios();
    res.send({ success: true, data: response });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

router.get("/countries", async (req: Request, res: Response) => {
  try {
    const response = await scraper.getStudioCountries();
    res.send({ success: true, data: response });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

router.get("/:country", async (req: Request, res: Response) => {
  try {
    const { country } = req.params;
    const response = await scraper.getStudiosByCountry(country);

    res.send({ success: true, data: response });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

router.get("/single/:name", async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const response = await scraper.getStudioByName(name);

    res.send({ success: true, data: response });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

export { router };