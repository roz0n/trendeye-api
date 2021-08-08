import { Request, Response } from "express";
import { Router } from "express";
import FeedbackController from "../controllers/feedback.controller";
import { FeedbackReport } from "../models/feedback.model";

const router = Router();
const controller = new FeedbackController();
const { POSITIVE, NEGATIVE } = controller;

router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      type,
      image,
      classificationResults,
      incorrectIdentifiers,
      correctIdentifiers,
      date,
      deviceInfo,
    } = req.body;

    if (
      // I don't really understand TypeScript string literal types, so let's just check like this:
      ![POSITIVE, NEGATIVE].includes(type) ||
      !type ||
      !date ||
      !deviceInfo
    ) {
      throw new Error("Malformed feedback data provided");
    }

    const report = new FeedbackReport(
      type,
      image,
      classificationResults,
      incorrectIdentifiers,
      correctIdentifiers,
      date,
      deviceInfo
    );

    await controller.saveFeedback(report);

    res.send({ success: true });
  } catch (error) {
    console.log("Error", error);
    res.status(500).send({ success: false, message: error.message });
  }
});

export { router };
