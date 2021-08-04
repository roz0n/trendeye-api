import { Request, Response } from "express";
import { Router } from "express";
import FeedbackController from "../controllers/feedback.controller";

const router = Router();
const controller = new FeedbackController();

router.get("/", async (req: Request, res: Response) => {
  try {
    await controller.savePositiveFeedback();
    res.send({ success: true });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

export { router };
