import { Request, Response } from "express";
import { Router } from "express";
import FeedbackController from "../controllers/feedback.controller";
import { FeedbackReport } from "../models/feedback.model";

const router = Router();
const controller = new FeedbackController();

router.post("/", async (req: Request, res: Response) => {
  try {
    // Check query to obtain report type
    let { type } = req.query;

    if (!type) {
      throw new Error("No feedback type provided");
    } else {
      let str = type as String;
      type = str.toLocaleLowerCase();
    }

    // Check and deconstruct request body to create report object
    const {
      image,
      classifiedIdentifiers,
      correctIdentifiers = null,
      date,
      deviceId,
      observationResult,
    } = req.body;

    if (
      !image ||
      !classifiedIdentifiers ||
      !correctIdentifiers ||
      !date ||
      !deviceId ||
      !observationResult
    ) {
      throw new Error("Invalid feedback");
    }

    let report = new FeedbackReport(
      type,
      image,
      classifiedIdentifiers,
      correctIdentifiers,
      date,
      deviceId,
      observationResult
    );

    if (type === FeedbackController.POSITIVE) {
      await controller.savePositiveFeedback(report);
    } else if (type === FeedbackController.NEGATIVE) {
      await controller.saveNegativeFeedback(report);
    } else {
      throw new Error("Invalid feedback type provided");
    }

    res.send({ success: true });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

export { router };
