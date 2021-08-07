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
      classificationResult,
      classificationIdentifiers,
      correctIdentifiers = null,
      date,
      deviceId,
    } = req.body;

    console.log("BODY", req.body);

    if (
      !image ||
      !classificationResult ||
      !classificationIdentifiers ||
      !correctIdentifiers ||
      !date ||
      !deviceId
    ) {
      throw new Error("Invalid feedback provided");
    }

    let report = new FeedbackReport(
      type,
      image,
      classificationResult,
      classificationIdentifiers,
      correctIdentifiers,
      date,
      deviceId
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
    console.log("ERRRRRRROOOORR", error);
    res.status(500).send({ success: false, message: error.message });
  }
});

export { router };
