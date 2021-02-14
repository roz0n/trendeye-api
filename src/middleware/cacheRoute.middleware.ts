import cache from "../cache";
import { Request, Response, NextFunction } from "express";

function cacheRoute(req: Request, res: Response, next: NextFunction) {
  const { originalUrl } = req;

  cache.get(originalUrl, (error, data) => {
    if (error) {
      console.log(`[REDIS] Error fetching cached response for route: ${originalUrl}`);
      res.status(500).send("Catastrophic error");
    }

    if (data) {
      res.send({ success: true, data: JSON.parse(data) });
    } else {
      next();
    }
  });
}

export default cacheRoute;
