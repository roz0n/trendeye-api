// import { Request, Response, NextFunction } from "express";
// import { Router } from "express";
// import ScrapeUtils from "../utils/Scraper";

// const router = Router();

// router.get(
//   "/",
//   async (err: Error, req: Request, res: Response, next: NextFunction) => {
//     try {
//       const response = await ScrapeUtils.StudioScraper.allByCountry;
//       res.send({ success: true, data: response });
//     } catch (error) {
//       res.status(500).send({ error: true, message: error.message });
//     }
//   }
// );

// module.exports = router;
