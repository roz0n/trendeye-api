import { Request, Response, NextFunction, Router } from "express";
import { StudioScraper } from "../utils/Scraper";

const router = Router();
const scraper = new StudioScraper();

// router.get(
//   "/",
//   async (err: Error, req: Request, res: Response, next: NextFunction) => {
//     try {
//       const response = await scraper.getAllStudiosByCountry();
//       res.send({ success: true, data: response });
//     } catch (error) {
//       res.status(500).send({ error: true, message: error.message });
//     }
//   }
// );

router.get(
  "/",
  async (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log("HITTING");
    try {
      const { name } = req.params;
      if (!name) throw new Error("No studio name provided");

      const response = await scraper.getStudioByName(name);
      res.send({ success: true, data: response });
    } catch (error) {
      res.status(500).send({ error: true, message: error.message });
    }
  }
);

export default router;
