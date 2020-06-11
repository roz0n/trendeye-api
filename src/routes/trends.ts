import { Request, Response } from "express";
import { Router } from "express";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  res.send({ success: true });
});

export { router };
